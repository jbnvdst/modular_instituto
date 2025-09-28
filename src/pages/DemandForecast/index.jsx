import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Calendar, AlertCircle, RefreshCw, Target } from 'lucide-react';
import { useAreas } from '../../utils/context/AreasContext';
import Layout from '../../components/Layout';
import axios from 'axios';

const DemandForecast = () => {
  const { areas, fetchAreas } = useAreas();
  const [selectedArea, setSelectedArea] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [allAreasPredictions, setAllAreasPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAreas();
    fetchAllAreasPredictions();
  }, []);

  const fetchAllAreasPredictions = async () => {
    setOverviewLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/demand-prediction/all-areas`
      );
      setAllAreasPredictions(response.data);
    } catch (err) {
      console.error('Error fetching all areas predictions:', err);
    } finally {
      setOverviewLoading(false);
    }
  };

  const fetchAreaPrediction = async (area) => {
    setLoading(true);
    setError(null);
    setSelectedArea(area);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/demand-prediction/area/${area.id}?months=6`
      );
      setPredictionData(response.data);
    } catch (err) {
      console.error('Error fetching prediction:', err);
      setError('Error al cargar predicción de demanda');
    } finally {
      setLoading(false);
    }
  };

  const resetView = () => {
    setSelectedArea(null);
    setPredictionData(null);
    setError(null);
  };

  if (selectedArea && predictionData) {
    const { summary, trend, predictions, modelStats, historicalData } = predictionData;
    const TrendIcon = trend.direction === 'increasing' ? TrendingUp : TrendingDown;
    const trendColor = trend.direction === 'increasing' ? 'text-green-600' : 'text-red-600';
    const trendBgColor = trend.direction === 'increasing' ? 'bg-green-50' : 'bg-red-50';

    return (
      <Layout>
        <div className="space-y-6">
          {/* Header with Back Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Pronóstico - {selectedArea.name}</h1>
              <p className="text-gray-600 mt-1">Predicción de demanda de servicios médicos</p>
            </div>
            <button
              onClick={resetView}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Volver al resumen
            </button>
          </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={20} />
              <h3 className="font-semibold">Error</h3>
            </div>
            <p className="text-red-700 mt-2">{error}</p>
          </div>
        ) : (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Current Trend */}
              <div className={`${trendBgColor} rounded-xl p-6`}>
                <div className="flex items-center gap-3 mb-3">
                  <TrendIcon size={24} className={trendColor} />
                  <h3 className="font-semibold text-gray-800">Tendencia</h3>
                </div>
                <div className={`text-2xl font-bold ${trendColor} mb-1`}>
                  {trend.direction === 'increasing' ? '+' : '-'}{trend.percentage}%
                </div>
                <p className="text-sm text-gray-600">
                  {trend.current} vs {trend.previous} tareas/mes
                </p>
              </div>

              {/* Next Month Prediction */}
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar size={24} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Próximo Mes</h3>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {summary.nextMonthPrediction.predictedTasks}
                </div>
                <p className="text-sm text-gray-600">
                  Tareas estimadas (Conf: {Math.round(summary.nextMonthPrediction.confidence * 100)}%)
                </p>
              </div>

              {/* Average Monthly Tasks */}
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 size={24} className="text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Promedio</h3>
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {summary.avgMonthlyTasks}
                </div>
                <p className="text-sm text-gray-600">Tareas por mes</p>
              </div>

              {/* Model Accuracy */}
              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Target size={24} className="text-green-600" />
                  <h3 className="font-semibold text-gray-800">Precisión</h3>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {Math.round(modelStats.taskModel.rSquared * 100)}%
                </div>
                <p className="text-sm text-gray-600">Confiabilidad del modelo</p>
              </div>
            </div>

            {/* Historical vs Predictions Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial y Predicciones</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Mes</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Tareas Reales</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Solicitudes Reales</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {historicalData.slice(-6).map((data, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {new Date(data.month + '-01').toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long'
                          })}
                        </td>
                        <td className="px-4 py-3 text-center text-blue-600 font-semibold">
                          {data.tasks}
                        </td>
                        <td className="px-4 py-3 text-center text-green-600 font-semibold">
                          {data.requests}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            Histórico
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Future Predictions Table */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Predicciones Futuras</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Mes</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Tareas Estimadas</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Solicitudes Estimadas</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Confianza</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {predictions.map((prediction, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {new Date(prediction.month + '-01').toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long'
                          })}
                        </td>
                        <td className="px-4 py-3 text-center text-blue-600 font-semibold">
                          {prediction.predictedTasks}
                        </td>
                        <td className="px-4 py-3 text-center text-green-600 font-semibold">
                          {prediction.predictedRequests}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            prediction.confidence > 0.8
                              ? 'bg-green-100 text-green-800'
                              : prediction.confidence > 0.6
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {Math.round(prediction.confidence * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Model Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Modelo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Algoritmo:</span> Regresión Lineal Simple
                </div>
                <div>
                  <span className="font-medium">Variables:</span> Tiempo, Tendencia, Estacionalidad
                </div>
                <div>
                  <span className="font-medium">R² Tareas:</span> {modelStats.taskModel.rSquared.toFixed(3)}
                </div>
                <div>
                  <span className="font-medium">R² Solicitudes:</span> {modelStats.requestModel.rSquared.toFixed(3)}
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Nota:</strong> Los datos históricos mostrados son generados sintéticamente para fines de demostración.
                  En producción, se utilizarían datos reales del sistema.
                </p>
              </div>
            </div>
          </>
        )}
        </div>
      </Layout>
    );
  }

  // Overview page
  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-xs sm:text-sm text-gray-500">
              Predicción de demanda de servicios médicos por área usando Machine Learning
            </p>
          </div>
          <button
            onClick={fetchAllAreasPredictions}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={18} />
            Actualizar Predicciones
          </button>
        </div>
        <hr className="my-3 sm:my-4 border-gray-200"/>

      {/* Quick Overview Cards */}
      {overviewLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allAreasPredictions.map((areaPred) => (
            <div
              key={areaPred.areaId}
              onClick={() => fetchAreaPrediction({ id: areaPred.areaId, name: areaPred.areaName })}
              className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-800 mb-3 truncate">{areaPred.areaName}</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Próximo mes:</span>
                  <span className="font-bold text-blue-600">{areaPred.nextMonthPrediction}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Confianza:</span>
                  <span className={`font-medium ${
                    areaPred.confidence > 80
                      ? 'text-green-600'
                      : areaPred.confidence > 60
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {areaPred.confidence}%
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800">
                  Ver detalles →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Information Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <BarChart3 size={24} className="text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">¿Cómo funciona la predicción?</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Nuestro sistema utiliza algoritmos de regresión lineal para analizar patrones históricos
              de demanda de servicios médicos. Considera factores como tendencias temporales,
              estacionalidad y volumen histórico de tareas para predecir la carga de trabajo futura
              en cada área médica.
            </p>
            <div className="mt-3 text-xs text-blue-600">
              <strong>Selecciona un área</strong> para ver predicciones detalladas y análisis de tendencias.
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default DemandForecast;
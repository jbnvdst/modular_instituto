const areas = [
        {
            "id": 1,
            "name": "Farmacia",
            "description": "Suministro y control de medicamentos e insumos esenciales para el tratamiento.",
            "owner": "Dr. Pedro Rodríguez",
            "tasks": [
            { "id": 1, "name": "Falta surtir medicamento de quimioterapia", "status": "Urgente", "askedBy": "Laura Méndez", "date": "2025-05-20" },
            { "id": 2, "name": "Inventario mensual pendiente", "status": "Atención", "askedBy": "Carlos Ríos", "date": "2025-05-18" },
            { "id": 3, "name": "Solicitar insumos al proveedor", "status": "Pendiente", "askedBy": "Mariana Torres", "date": "2025-05-19" },
            { "id": 4, "name": "Revisión de protocolo para nuevo tratamiento", "status": "Pendiente", "askedBy": "Luis García", "date": "2025-05-21" },
            { "id": 16, "name": "Medicamentos refrigerados sin control de temperatura", "status": "Urgente", "askedBy": "Ana Ruiz", "date": "2025-05-22" },
            { "id": 17, "name": "Falta actualizar base de datos de fármacos", "status": "Pendiente", "askedBy": "Miguel Herrera", "date": "2025-05-23" }
            ]
        },
        {
            "id": 2,
            "name": "Oncología Médica",
            "description": "Diagnóstico y tratamiento integral del cáncer mediante quimioterapia y fármacos.",
            "owner": "Dra. Yessica Marmolejo",
            "tasks": [
            { "id": 5, "name": "Faltan resultados de laboratorio para paciente", "status": "Urgente", "askedBy": "Carolina Vargas", "date": "2025-05-22" },
            { "id": 6, "name": "Actualizar historial clínico digital", "status": "Atención", "askedBy": "Oscar Medina", "date": "2025-05-20" }
            ]
        },
        {
            "id": 3,
            "name": "Enfermería",
            "description": "Atención directa al paciente, administración de medicamentos y monitoreo continuo.",
            "owner": "Dra. Sofía López",
            "tasks": [
            { "id": 7, "name": "Suministro de guantes y mascarillas bajo", "status": "Urgente", "askedBy": "Lucía Moreno", "date": "2025-05-18" },
            { "id": 8, "name": "Capacitación en manejo de bomba de infusión", "status": "Pendiente", "askedBy": "Alejandro Peña", "date": "2025-05-19" },
            { "id": 9, "name": "Revisión de bitácoras de turnos", "status": "Atención", "askedBy": "Gloria Núñez", "date": "2025-05-20" },
            { "id": 18, "name": "Rotación incompleta del personal de turno", "status": "Atención", "askedBy": "Isabel Sánchez", "date": "2025-05-21" },
            { "id": 19, "name": "Reportes de administración de medicamentos sin firmar", "status": "Urgente", "askedBy": "Diego Castro", "date": "2025-05-24" }
            ]
        },
        {
            "id": 4,
            "name": "Administración",
            "description": "Gestión de recursos, personal, compras y operaciones internas del hospital.",
            "owner": "Dr. Guillermo Salcedo",
            "tasks": [
            { "id": 10, "name": "Falta firmar convenios con proveedores", "status": "Pendiente", "askedBy": "Carmen Gutiérrez", "date": "2025-05-17" },
            { "id": 11, "name": "Solicitudes de pago atrasadas", "status": "Urgente", "askedBy": "Raúl Martínez", "date": "2025-05-18" },
            { "id": 12, "name": "Actualizar directorio institucional", "status": "Atención", "askedBy": "Daniela Flores", "date": "2025-05-23" },
            { "id": 13, "name": "Falla en equipo de radioterapia", "status": "Urgente", "askedBy": "Pedro Jiménez", "date": "2025-05-20" },
            { "id": 14, "name": "Revisión anual de calibración de equipos", "status": "Pendiente", "askedBy": "Natalia León", "date": "2025-05-21" },
            { "id": 20, "name": "Falta enviar reporte mensual al Ministerio de Salud", "status": "Urgente", "askedBy": "Esteban Bravo", "date": "2025-05-22" },
            { "id": 21, "name": "Retrasos en contratación de nuevo personal", "status": "Pendiente", "askedBy": "Fernanda Pineda", "date": "2025-05-23" }
            ]
        },
        {
            "id": 5,
            "name": "Radioterapia",
            "description": "Aplicación de tratamientos con radiación para combatir células cancerosas.",
            "owner": "Dr. Pablo Macias",
            "tasks": [
            { "id": 15, "name": "Carga incompleta de expedientes en sistema", "status": "Atención", "askedBy": "Claudia Rivera", "date": "2025-05-20" },
            { "id": 22, "name": "Faltan dosímetros personales en stock", "status": "Urgente", "askedBy": "Andrés Figueroa", "date": "2025-05-21" }
            ]
        },
        {
            "id": 6,
            "name": "Urgencias",
            "description": "Atención inmediata a pacientes con condiciones críticas o complicaciones graves.",
            "owner": "Dr. Javier Martínez",
            "tasks": [
            { "id": 1, "name": "Falta surtir medicamento de quimioterapia", "status": "Urgente", "askedBy": "Laura Méndez", "date": "2025-05-20" },
            { "id": 23, "name": "Sesiones de apoyo emocional no agendadas", "status": "Pendiente", "askedBy": "Andrea Lozano", "date": "2025-05-22" },
            { "id": 24, "name": "Informe de evolución psicológica sin actualizar", "status": "Atención", "askedBy": "José Barajas", "date": "2025-05-21" },
            { "id": 25, "name": "Falta desinfección en área de quimioterapia", "status": "Urgente", "askedBy": "Karen Salas", "date": "2025-05-23" }
            ]
        }
    ]

    export { areas };
import React from 'react'

function ToggleSwitch({ word1 = 'ON', word2 = 'OFF', value = false, onChange = () => {} }) {
  return (
    <div className='flex gap-2 items-center'>
      <b className='text-gray-500 text-sm'>{word1}</b>
      <label className="group relative inline-flex cursor-pointer flex-col items-center">
        <input
          className="peer sr-only"
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="relative h-6 w-12 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 shadow-[inset_0_1px_4px_rgba(0,0,0,0.6)] transition-all duration-500
          after:absolute after:left-0.5 after:top-[1.8px] after:h-5 after:w-5 after:rounded-full after:bg-gradient-to-br after:from-gray-100 after:to-gray-300 after:shadow-[1px_1px_4px_rgba(0,0,0,0.3)] after:transition-all after:duration-500
          peer-checked:bg-gradient-to-r peer-checked:from-teal-600 peer-checked:to-teal-800 peer-checked:after:translate-x-6 peer-checked:after:from-white peer-checked:after:to-gray-100
          hover:after:scale-95 active:after:scale-90">
          <span className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent"></span>
          <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 peer-checked:animate-glow peer-checked:opacity-100 [box-shadow:0_0_7px_rgba(167,139,250,0.5)]"></span>
        </div>
      </label>
      <b className='text-gray-500 text-sm'>{word2}</b>
    </div>
  )
}

export { ToggleSwitch }

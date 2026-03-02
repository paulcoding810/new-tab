import { useEffect, useState } from 'react'
import { settingsStorage } from '../helper'
import Input from '../components/Input'

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between py-2 cursor-pointer group">
    <span className="text-gray-700 group-hover:text-gray-900">{label}</span>
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="h-6 transition-colors bg-gray-300 rounded-full w-11 peer-checked:bg-blue-500" />
      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
    </div>
  </label>
)

const ConfigSection = ({ onConfigChanged }) => {
  const [showTime, setShowTime] = useState(false)
  const [showWeather, setShowWeather] = useState(false)
  const [showWallpaper, setShowWallpaper] = useState(true)
  const [unit, setUnit] = useState('C')
  const [apiKey, setApiKey] = useState('')
  const [blur, setBlur] = useState(0)
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    settingsStorage.get().then((config) => {
      setShowWallpaper(config.showWallpaper ?? true)
      setShowTime(config.showsTime ?? false)
      setBlur(config.blur ?? 0)
      setApiKey(config.weatherApiKey || '')
      setShowWeather(config.showsWeather ?? false)
      setUnit(config.weatherUnit || 'C')
    })
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (apiKey !== null) settingsStorage.set('weatherApiKey', apiKey)
    }, 500)
    return () => clearTimeout(timeout)
  }, [apiKey])

  const handleToggle = (key, value, setter) => {
    setter(value)
    settingsStorage.set(key, value)
    onConfigChanged()
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">Display Settings</h2>

      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
          Components
        </h3>
        <div className="divide-y divide-gray-100">
          <Toggle
            label="Wallpaper"
            checked={showWallpaper}
            onChange={(checked) => handleToggle('showsWallpaper', checked, setShowWallpaper)}
          />
          <Toggle
            label="Clock"
            checked={showTime}
            onChange={(checked) => handleToggle('showsTime', checked, setShowTime)}
          />
          <Toggle
            label="Weather"
            checked={showWeather}
            onChange={(checked) => handleToggle('showsWeather', checked, setShowWeather)}
          />
        </div>
      </div>

      {showWeather && (
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
            Weather
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-gray-600">OpenWeatherMap API Key</label>
              <div className="relative">
                <Input
                  value={apiKey}
                  setValue={setApiKey}
                  placeholder="Enter your OpenWeatherMap API key"
                  type={showApiKey ? 'text' : 'password'}
                  onPaste={(e) => e.stopPropagation()}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute text-sm text-gray-400 -translate-y-1/2 right-2 top-1/2 hover:text-gray-600"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Temperature Unit</label>
              <div className="flex gap-2">
                {['C', 'F'].map((u) => (
                  <button
                    key={u}
                    onClick={() => {
                      handleToggle('weatherUnit', u, setUnit)
                    }}
                    className={`px-4 py-2 rounded border transition-colors ${
                      unit === u
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    °{u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
          Effects
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-gray-700">Background Blur</label>
            <span className="text-sm font-medium text-gray-500">{blur}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={blur}
            onChange={(e) => {
              const newValue = parseInt(e.target.value)
              handleToggle('blur', newValue, setBlur)
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

export default ConfigSection

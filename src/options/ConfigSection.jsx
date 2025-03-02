import { useEffect, useState } from 'react'
import { settingsStorage } from '../helper'

const ConfigSection = ({ onConfigChanged }) => {
  const [showsTime, setshowsTime] = useState(false)
  const [showsWeather, setShowsWeather] = useState(false)
  const [unit, setUnit] = useState('C')
  const [apiKey, setApiKey] = useState(null)
  const [blurValue, setBlurValue] = useState(0)

  useEffect(() => {
    settingsStorage.get().then((config) => {
      setshowsTime(config.showsTime ?? false)
      setBlurValue(config.blur ?? 0)
      setApiKey(config.weatherApiKey)
      setShowsWeather(config.showsWeather ?? false)
    })
  }, [])

  // debounce saving apiKey to storage
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (apiKey) settingsStorage.set('weatherApiKey', apiKey)
    }, 500)

    return () => clearTimeout(timeout)
  }, [apiKey])

  return (
    <div className="flex flex-col gap-2">
      <h2 className="mb-2 text-xl font-bold">Config</h2>
      <label htmlFor="showsTime" className="flex items-center gap-2">
        <span className="w-[100px]">Show Clock</span>
        <input
          type="checkbox"
          id="showsTime"
          checked={showsTime}
          onChange={(e) => {
            const checked = e.target.checked
            setshowsTime(checked)
            onConfigChanged()
            settingsStorage.set('showsTime', checked)
          }}
        />
      </label>
      <label htmlFor="showsWeather" className="flex items-center gap-2">
        <span className="w-[100px]">Show Weather</span>
        <input
          type="checkbox"
          id="showsWeather"
          checked={showsWeather}
          onChange={(e) => {
            const checked = e.target.checked
            setShowsWeather(checked)
            settingsStorage.set('showsWeather', checked)
            onConfigChanged()
          }}
        />
        {showsWeather && (
          <div className="flex flex-row items-center ml-4 space-x-2">
            <span>OpenWeatherMap API</span>
            <input
              placeholder="Enter your OpenWeatherMap API key here"
              type="text"
              className="w-[250px] text-[10px] px-2 py-1 ml-4 border-2 border-gray-300 rounded outline-none focus:border-blue-500"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onPaste={(e) => {
                e.stopPropagation()
              }}
            />

            <span>Unit</span>
            <select
              className="w-[50px] text-[10px] px-2 py-1 border-2 border-gray-300 rounded outline-none focus:border-blue-500 text-center"
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value)
                settingsStorage.set('weatherUnit', e.target.value)
                onConfigChanged()
              }}
            >
              <option value="C">°C</option>
              <option value="F">°F</option>
            </select>
          </div>
        )}
      </label>
      <label htmlFor="blurSlider" className="flex items-center gap-2">
        <span className="w-[100px]">Blur</span>
        <input
          type="range"
          id="blurSlider"
          min="0"
          max="100"
          value={blurValue}
          onChange={(e) => {
            const newValue = parseInt(e.target.value)
            setBlurValue(newValue)
            onConfigChanged()
            settingsStorage.set('blur', newValue)
          }}
        />
        <span>{blurValue}%</span>
      </label>
    </div>
  )
}

export default ConfigSection

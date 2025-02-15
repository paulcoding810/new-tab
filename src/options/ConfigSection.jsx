import { useEffect, useState } from 'react'
import { settingsStorage } from '../helper'

const ConfigSection = () => {
  const [showsTime, setshowsTime] = useState(false)
  const [blurValue, setBlurValue] = useState(0)

  useEffect(() => {
    settingsStorage.get().then((config) => {
      setshowsTime(config.showsTime ?? false)
      setBlurValue(config.blur ?? 0)
    })
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <h2 className="mb-2 text-xl font-bold">Config</h2>
      <label htmlFor="showsTime" className="flex items-center gap-2">
        <span className='w-[100px]'>Show Clock</span>
        <input
          type="checkbox"
          id="showsTime"
          checked={showsTime}
          onChange={(e) => {
            const checked = e.target.checked
            setshowsTime(checked)
            settingsStorage.set('showsTime', checked)
          }}
        />
      </label>
      <label htmlFor="blurSlider" className="flex items-center gap-2">
        <span className='w-[100px]'>Blur</span>
        <input
          type="range"
          id="blurSlider"
          min="0"
          max="100"
          value={blurValue}
          onChange={(e) => {
            const newValue = parseInt(e.target.value)
            setBlurValue(newValue)
            settingsStorage.set('blur', newValue)
          }}
        />
        <span>{blurValue}%</span>
      </label>
    </div>
  )
}

export default ConfigSection

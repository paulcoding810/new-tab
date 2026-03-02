import { useEffect, useState, useCallback } from 'react'
import MESSAGE from '../constants'
import { db, settingsStorage } from '../helper'
import '../index.css'
import Background from './Background'
import Time from './Time'
import Weather from './Weather'

export const NewTab = () => {
  const [media, setMedia] = useState(null)
  const [config, setConfig] = useState({})
  const [dominantColor, setDominantColor] = useState(null)

  const loadData = useCallback(async () => {
    try {
      const [mediaId, configData] = await Promise.all([
        settingsStorage.get('mediaId'),
        settingsStorage.get(),
      ])
      setConfig(configData)

      if (mediaId) {
        const mediaData = await db.get(mediaId)
        setMedia(mediaData)
      }
    } catch (err) {
      console.error('[NewTab]: Failed to load data', err)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    let timeout
    const listener = (request) => {
      if (request.type === MESSAGE.SETTINGS_UPDATED) {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(loadData, 200)
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => {
      chrome.runtime.onMessage.removeListener(listener)
      if (timeout) clearTimeout(timeout)
    }
  }, [loadData])

  const textColor = dominantColor ?? 'white'

  return (
    <div className="fixed inset-0 flex flex-col w-screen h-screen">
      {config.showsWallpaper && (
        <div className="absolute inset-0 pointer-events-none select-none -z-10">
          {media && <Background media={media} blur={config.blur} onColorThief={setDominantColor} />}
        </div>
      )}

      {config.showsWeather && (
        <div
          className="absolute font-bold transition-colors top-5 right-5"
          style={{ color: textColor }}
        >
          <Weather />
        </div>
      )}

      {config.showsTime && (
        <div
          className="absolute font-bold tracking-tight transition-colors bottom-8 right-8 text-7xl"
          style={{ color: textColor }}
        >
          <Time />
        </div>
      )}
    </div>
  )
}

export default NewTab

import { useEffect, useState } from 'react'
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

  function initialize() {
    settingsStorage.get('mediaId').then((mediaId) => {
      if (mediaId) {
        db.get(mediaId)
          .then((res) => {
            setMedia(res)
          })
          .catch((err) => {
            console.error('[NewTab]: Failed to load media from db', err)
          })
      }
    })

    settingsStorage.get().then(setConfig)
  }

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    let timeout
    function listener(request, _sender, _sendResponse) {
      if (request.type === MESSAGE.SETTINGS_UPDATED) {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(initialize, 200)
      }
    }
    chrome.runtime.onMessage.addListener(listener)

    return () => {
      chrome.runtime.onMessage.removeListener(listener)
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="fixed flex flex-col flex-1 w-screen h-screen">
      <div className="absolute z-[-1] w-full h-full select-none pointer-events-none">
        {media && <Background media={media} blur={config.blur} onColorThief={setDominantColor} />}
      </div>
      {config.showsTime && (
        <div
          className="absolute text-6xl font-bold text-white bottom-5 right-5"
          style={{ color: dominantColor ?? 'black' }}
        >
          <Time />
        </div>
      )}
      {config.showsWeather && (
        <div
          className="absolute font-bold top-5 right-5"
          style={{ color: dominantColor ?? 'black' }}
        >
          <Weather />
        </div>
      )}
    </div>
  )
}

export default NewTab

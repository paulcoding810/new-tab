import { useEffect, useState } from 'react'
import MESSAGE from '../constants'
import { settingsStorage } from '../helper'
import '../index.css'
import ConfigSection from './ConfigSection'
import MediaSection from './MediaSection'

export const Options = () => {
  const sendUpdateMessage = () => {
    chrome.runtime.sendMessage({ type: MESSAGE.SETTINGS_UPDATED })
  }

  const [config, setConfig] = useState(null)

  useEffect(() => {
    settingsStorage.get().then(setConfig)
  }, [])

  if (!config) return null

  return (
    <main className="flex flex-col flex-1 w-screen h-screen px-4 py-6 md:px-[10%] bg-gray-50">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <ConfigSection config={config} onConfigChanged={sendUpdateMessage} />
        <hr className="border-gray-200" />
        <MediaSection onMediaApplied={sendUpdateMessage} />
      </div>
    </main>
  )
}

export default Options

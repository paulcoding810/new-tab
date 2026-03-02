import MESSAGE from '../constants'
import '../index.css'
import ConfigSection from './ConfigSection'
import MediaSection from './MediaSection'

export const Options = () => {
  const sendUpdateMessage = () => {
    chrome.runtime.sendMessage({ type: MESSAGE.SETTINGS_UPDATED })
  }

  return (
    <main className="flex flex-col flex-1 w-screen h-screen px-4 py-6 md:px-[10%] bg-gray-50">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <ConfigSection onConfigChanged={sendUpdateMessage} />
        <hr className="border-gray-200" />
        <MediaSection onMediaApplied={sendUpdateMessage} />
      </div>
    </main>
  )
}

export default Options

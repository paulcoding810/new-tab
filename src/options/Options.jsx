import MESSAGE from '../constants'
import '../index.css'
import ConfigSection from './ConfigSection'
import MediaSection from './MediaSection'

export const Options = () => {
  function sendUpdateMessage() {
    const message = { type: MESSAGE.SETTINGS_UPDATED }
    chrome.runtime.sendMessage(message)
  }

  return (
    <main className="flex flex-col flex-1 w-screen h-screen py-4 px-[10%]">
      <ConfigSection onConfigChanged={sendUpdateMessage}  />
      <hr className="my-2" />
      <MediaSection onMediaApplied={sendUpdateMessage} />
    </main>
  )
}

export default Options

import { useEffect, useState } from 'react'
import IndexedDBWrapper from '../helper/IDB'
import Storage from '../helper/Storage'
import '../index.css'
import Background from './Background'
import Time from './Time'

const db = new IndexedDBWrapper('NewTab', 'media')
const settingsStorage = new Storage('settings')

const config = settingsStorage.get() ?? {}

export const NewTab = () => {
  const [media, setMedia] = useState(null)

  useEffect(() => {
    settingsStorage.get('videoId').then((videoId) => {
      if (videoId) {
        db.get(videoId)
          .then((res) => {
            setMedia(res)
          })
          .catch((err) => {
            console.error('🚀 ~ db.get ~ err:', err)
          })
      }
    })
  }, [])

  return (
    <div className="fixed flex flex-col flex-1 w-screen h-screen">
      <div className="absolute z-[-1] w-full h-full">
        {media && <Background media={media} blur={config.blur} />}
      </div>
      {config.showsTime && (
        <div className="absolute text-6xl font-bold text-white bottom-5 right-5">
          <Time />
        </div>
      )}
    </div>
  )
}

export default NewTab

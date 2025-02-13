import { useEffect, useState } from 'react'
import { db, settingsStorage } from '../helper'
import '../index.css'
import Background from './Background'
import Time from './Time'

export const NewTab = () => {
  const [media, setMedia] = useState(null)
  const [config, setConfig] = useState({})

  useEffect(() => {
    settingsStorage.get('mediaId').then((mediaId) => {
      if (mediaId) {
        db.get(mediaId)
          .then((res) => {
            setMedia(res)
          })
          .catch((err) => {
            console.error('🚀 ~ db.get ~ err:', err)
          })
      }
    })

    settingsStorage.get().then(setConfig)
  }, [])

  return (
    <div className="fixed flex flex-col flex-1 w-screen h-screen">
      <div className="absolute z-[-1] w-full h-full">
        {media ? <Background media={media} blur={config.blur} /> : <img src="img/cat.jpeg" />}
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

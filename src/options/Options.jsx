import { useEffect, useState } from 'react'
import checkIcon from '../assets/check.svg'
import deleteIcon from '../assets/delete.svg'
import downloadIcon from '../assets/download.svg'
import loadingIcon from '../assets/loading.svg'
import ProgressBar from '../components/ProgressBar'
import { showToast } from '../components/Toast'
import IndexedDBWrapper from '../helper/IDB'
import Storage from '../helper/Storage'
import '../index.css'
import Background from '../newtab/Background'
import { fetchVideo } from '../xhr'

const db = new IndexedDBWrapper('NewTab', 'media')
const settingsStorage = new Storage('settings')

async function saveVideoBlob(videoUrl, onProgress) {
  const blob = await fetchVideo(videoUrl, onProgress)

  const id = await db.add({
    blob,
    url: videoUrl,
  })

  const video = await db.get(id)

  return video
}

async function isPermissionsGranted() {
  return await chrome.permissions.contains({
    origins: ['https://*/*'],
  })
}

export const Options = () => {
  const [media, setMedia] = useState(null)
  const [medias, setMedias] = useState([])
  const [url, setUrl] = useState('https://www.w3schools.com/html/mov_bbb.mp4')
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [granted, setGranted] = useState(false)

  function logAndSetError(error) {
    setError(error)
    console.error(error)
  }

  async function fetchMedia() {
    if (!url) return console.error('No URL provided')

    // check if video already exists in db
    const foundMedia = medias.find((item) => item.url === url)
    if (foundMedia) {
      showToast('Video already exists in database')
      setMedia(foundMedia)
      return foundMedia
    }

    setProgress(0)
    setMedia(null)
    setIsLoading(true)
    try {
      const data = await saveVideoBlob(url, setProgress)
      setMedia(data)
      fetchMedias()
    } catch (error) {
      logAndSetError(error)
    } finally {
      setIsLoading(false)
    }
  }

  function fetchMedias() {
    setIsLoading(true)
    db.getAll()
      .then(setMedias)
      .catch(logAndSetError)
      .finally(() => setIsLoading(false))
  }

  async function deleteMedia(item) {
    const id = item.id
    const currentId = await settingsStorage.get('videoId')
    if (id === currentId) {
      await settingsStorage.set('videoId', null)
    }
    db.delete(id)
      .then(() => fetchMedias())
      .catch(logAndSetError)
  }

  function applyMedia(newMedia) {
    settingsStorage
      .set('videoId', newMedia.id)
      .then(() => {
        showToast('Changes applied successfully')
      })
      .catch(logAndSetError)
  }

  function requestPermission() {
    chrome.permissions.request(
      {
        origins: ['https://*/*'],
      },
      (granted) => {
        if (granted) {
          setGranted(true)
          showToast('Permission granted')
        } else {
          showToast('Permission denied')
        }
      },
    )
  }

  // const onVisibilitychange = useCallback((event) => {
  //   if (document.visibilityState === 'visible') {
  //     console.log('checking permission')
  //     isPermissionsGranted().then((res) => console.log('granted=', res))
  //     isPermissionsGranted().then(setGranted)
  //   }
  // }, [])

  // useEffect(() => {
  //   document.addEventListener('visibilitychange', onVisibilitychange)
  //   return () => {
  //     document.removeEventListener('visibilitychange', onVisibilitychange)
  //   }
  // }, [onVisibilitychange])

  useEffect(() => {
    db.open().then(async (_) => {
      fetchMedias()
    })

    isPermissionsGranted().then((res) => setGranted(res))
  }, [])

  if (!granted)
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <h1 className="text-2xl font-bold text-red-500">Permission Denied</h1>
        <p>This extension requires access to your data on all websites to function correctly.</p>
        <p>
          It retrieves media data from the user's URL and saves it to IndexedDB for offline viewing.
          It does not store user-generated content or third-party cookies, nor does it track or
          share user activity.
        </p>
        <p>
          This extension is open-source and available on{' '}
          <a
            href="https://github.com/paulcoding810/new-tab"
            className="text-blue-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github.
          </a>
        </p>
        <button
          className="px-4 py-2 font-bold text-blue-700 uppercase bg-white border border-blue-500 rounded-lg hover:bg-blue-200"
          onClick={requestPermission}
        >
          Request Permission
        </button>
      </div>
    )

  return (
    <main className="flex flex-col flex-1 w-screen h-screen">
      <div className="flex flex-col items-center justify-center gap-2">
        <input
          className="flex flex-1 px-2 py-1 border-2 border-blue-500 rounded outline-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Video URL"
        />

        <button
          className="px-4 py-2 font-bold text-blue-700 uppercase bg-white border border-blue-500 rounded-lg"
          onClick={fetchMedia}
        >
          {isLoading ? <img className="w-6 h-6" src={loadingIcon} /> : 'Fetch'}
        </button>

        <div className="flex items-center self-center flex-1 w-1/2 h-4">
          {progress > 0 && isLoading && <ProgressBar progress={progress} />}
        </div>
        {error && <p className="text-red-500">{error.message}</p>}

        {/* {media && (
          <div className="flex flex-col items-center flex-1 w-1/2 gap-2">
            <Background media={media} height={'auto'} />
            <button
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded active:bg-blue-700"
              onClick={() => applyMedia(media)}
            >
              Apply
            </button>
          </div>
        )} */}

        <div className="px-6 py-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{`${medias.length} items.`}</h3>
          <div className="flex flex-row flex-wrap gap-2">
            {medias.toReversed().map((item) => {
              const blueBorder = item.url === media?.url ? 'bg-blue-200 border-blue-500' : ''

              return (
                <div
                  key={item.id}
                  className={`flex flex-col items-center gap-2 p-2 bg-white border rounded shadow-md ${blueBorder}`}
                >
                  <Background
                    media={item}
                    width="320px"
                    height="240px"
                    autoPlay={false}
                    controls={true}
                  />

                  <div className="flex flex-row items-center justify-between w-full">
                    <button
                      className="flex flex-row items-center gap-1 px-2 py-1 font-bold text-blue-500 border border-blue-500 rounded hover:bg-blue-200"
                      onClick={() => applyMedia(item)}
                    >
                      <img src={checkIcon} />
                      <span>Apply</span>
                    </button>
                    <button className="flex flex-row items-center gap-1 px-2 py-1 font-bold text-blue-500 border border-blue-500 rounded hover:bg-blue-200">
                      <img src={downloadIcon} />
                      <span>Download</span>
                    </button>
                    <button
                      className="flex flex-row items-center gap-1 px-2 py-1 font-bold text-blue-500 border border-blue-500 rounded hover:bg-blue-200"
                      onClick={() => deleteMedia(item)}
                    >
                      <img src={deleteIcon} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Options

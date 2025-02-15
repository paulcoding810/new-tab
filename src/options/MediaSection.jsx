import { useEffect, useState } from 'react'
import checkIcon from '../assets/check.svg'
import deleteIcon from '../assets/delete.svg'
import downloadIcon from '../assets/download.svg'
import loadingIcon from '../assets/loading.svg'
import Input from '../components/Input'
import ProgressBar from '../components/ProgressBar'
import { showToast } from '../components/Toast'
import { db, isPermissionsGranted, isValidURL, saveMediaBlob, settingsStorage } from '../helper'
import Background from '../newtab/Background'
import { downloadBlob } from './utils'

const MediaSection = () => {
  const [media, setMedia] = useState(null)
  const [medias, setMedias] = useState([])
  const [url, setUrl] = useState('')
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [granted, setGranted] = useState(false)

  function logAndSetError(error) {
    setError(error)
    console.error(error)
  }

  async function fetchMedia() {
    if (!url) {
      setError({ message: 'No URL provided' })
      return console.error('No URL provided')
    }

    if (!isValidURL(url)) {
      setError({ message: 'Invalid URL' })
      return console.error('Invalid URL')
    }

    const foundMedia = await db.getByIndex('urlIndex', url)

    if (foundMedia) {
      showToast('Media already exists in database')
      return
    }

    setProgress(0)
    setMedia(null)
    setIsLoading(true)
    try {
      const data = await saveMediaBlob(url, setProgress)
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
    const currentId = await settingsStorage.get('mediaId')
    if (id === currentId) {
      await settingsStorage.set('mediaId', null)
    }
    db.delete(id)
      .then(() => fetchMedias())
      .catch(logAndSetError)
  }

  function applyMedia(newMedia) {
    settingsStorage
      .set('mediaId', newMedia.id)
      .then(() => {
        setMedia(newMedia)
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

  function onInputValue(text) {
    if (error) setError(null)
    setUrl(text)
  }

  async function getAppliedMedia() {
    try {
      const mediaId = await settingsStorage.get('mediaId')
      if (mediaId) setMedia(await db.get(mediaId))
      else setMedia(null)
    } catch (error) {
      logAndSetError(error)
    }
  }

  useEffect(() => {
    db.open().then(async (_) => {
      fetchMedias()
      getAppliedMedia()
    })

    isPermissionsGranted().then((res) => setGranted(res))
  }, [])

  if (!granted)
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 p-4">
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
    <div className="flex flex-col justify-center gap-2">
      <h2 className="mb-2 text-xl font-bold">Background</h2>

      <Input value={url} setValue={onInputValue} placeholder="Enter Media URL" />

      <button
        className="flex self-center px-4 py-2 font-bold text-blue-700 uppercase bg-white border border-blue-500 rounded-lg"
        onClick={fetchMedia}
      >
        {isLoading ? <img className="w-6 h-6" src={loadingIcon} /> : 'Fetch'}
      </button>

      <div className="flex items-center self-center flex-1 h-4">
        {progress > 0 && isLoading && <ProgressBar progress={progress} />}
      </div>
      {error && <p className="self-center text-red-500">{error.message}</p>}

      <div>
        <h3 className="text-lg font-semibold text-gray-800">{`${medias.length} items.`}</h3>
        <div className="flex flex-row flex-wrap gap-2">
          {medias.toReversed().map((item) => {
            const isApplied = item.id === media?.id
            const backgroundStyle = isApplied ? 'bg-blue-50 border-blue-500' : 'bg-white'

            return (
              <div
                key={item.id}
                className={`flex flex-col items-center gap-2 p-2 border rounded shadow-md ${backgroundStyle}`}
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
                    className="flex flex-row items-center gap-1 px-2 py-1 text-sm font-bold text-blue-500 border border-blue-500 rounded hover:bg-blue-200"
                    onClick={() => applyMedia(item)}
                  >
                    <img src={checkIcon} />
                    <span>{isApplied ? 'Applied' : 'Apply'}</span>
                  </button>
                  <button
                    className="flex flex-row items-center gap-1 px-2 py-1 text-sm font-bold text-blue-500 border border-blue-500 rounded hover:bg-blue-200"
                    onClick={() => {
                      downloadBlob(item.blob, Date.now())
                    }}
                  >
                    <img src={downloadIcon} />
                    <span>Download</span>
                  </button>
                  <button
                    className="flex flex-row items-center gap-1 px-2 py-1 text-sm font-bold text-red-500 border border-red-500 rounded hover:bg-red-200"
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
  )
}

export default MediaSection

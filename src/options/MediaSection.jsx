import { useEffect, useState } from 'react'
import colors from 'tailwindcss/colors'
import Check from '../assets/check.svg?react'
import deleteIcon from '../assets/delete.svg'
import downloadIcon from '../assets/download.svg'
import ExpandDown from '../assets/expand_down.svg?react'
import ExpandUp from '../assets/expand_up.svg?react'
import loadingIcon from '../assets/loading.svg'
import Input from '../components/Input'
import MediaUploader from '../components/MediaUploader'
import ProgressBar from '../components/ProgressBar'
import { showToast } from '../components/Toast'
import {
  db,
  fetchUrlAndSaveMediaBlob,
  isPermissionsGranted,
  isUrlDuplicated,
  isValidURL,
  saveMediaBlob,
  settingsStorage,
} from '../helper'
import Background from '../newtab/Background'
import { downloadBlob } from './utils'

const MediaSection = ({ onMediaApplied }) => {
  const [media, setMedia] = useState(null)
  const [medias, setMedias] = useState([])
  const [url, setUrl] = useState('')
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [granted, setGranted] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const logAndSetError = (err) => {
    const error = typeof err == 'string' ? new Error(err) : err
    setError(error)
    console.error('[NewTab]:', error)
  }

  const fetchMedia = async () => {
    if (!url) {
      logAndSetError('No URL provided')
      return
    }
    if (!isValidURL(url)) {
      logAndSetError('Invalid URL')
      return
    }

    const duplicated = await isUrlDuplicated(url)
    if (duplicated) {
      showToast('Media already exists in database')
      return
    }

    setProgress(0)
    setIsLoading(true)
    try {
      await fetchUrlAndSaveMediaBlob(url, setProgress)
      fetchMedias()
    } catch (err) {
      logAndSetError(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMedias = () => {
    setIsLoading(true)
    db.getAll()
      .then(setMedias)
      .catch(logAndSetError)
      .finally(() => setIsLoading(false))
  }

  const deleteMedia = async (item) => {
    const id = item.id
    const currentId = await settingsStorage.get('mediaId')
    if (id === currentId) {
      await settingsStorage.set('mediaId', null)
    }
    db.delete(id)
      .then(() => fetchMedias())
      .catch(logAndSetError)
  }

  const applyMedia = (newMedia) => {
    settingsStorage
      .set('mediaId', newMedia.id)
      .then(() => {
        setMedia(newMedia)
        onMediaApplied()
        showToast('Changes applied successfully')
      })
      .catch(logAndSetError)
  }

  const requestPermission = () => {
    chrome.permissions.request({ origins: ['https://*/*'] }, (granted) => {
      if (granted) {
        setGranted(true)
        showToast('Permission granted')
      } else {
        showToast('Permission denied')
      }
    })
  }

  const onFiles = async (files) => {
    try {
      for (const file of files) {
        await saveMediaBlob(`file://${Date.now()}_${file.name}`, file)
      }
      fetchMedias()
    } catch (err) {
      logAndSetError(err)
    }
  }

  const getAppliedMedia = async () => {
    try {
      const mediaId = await settingsStorage.get('mediaId')
      if (mediaId) setMedia(await db.get(mediaId))
      else setMedia(null)
    } catch (err) {
      logAndSetError(err)
    }
  }

  useEffect(() => {
    db.open().then(() => {
      fetchMedias()
      getAppliedMedia()
    })
    isPermissionsGranted().then((res) => setGranted(res))
  }, [])

  if (!granted) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8 text-center bg-white border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-red-500">Permission Required</h1>
        <p className="max-w-md text-gray-600">
          This extension requires access to your data on all websites to retrieve media from URLs
          and save it for offline viewing.
        </p>
        <p className="max-w-md text-sm text-gray-500">
          It does not store user-generated content, third-party cookies, or track your activity.
        </p>
        <p className="text-sm text-gray-500">
          Open source on{' '}
          <a
            href="https://github.com/paulcoding810/new-tab"
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
        <button
          className="px-6 py-3 font-semibold text-blue-600 transition-colors bg-white border-2 border-blue-500 rounded-lg hover:bg-blue-50"
          onClick={requestPermission}
        >
          Request Permission
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Background</h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 transition-colors rounded-full hover:bg-gray-100"
        >
          {expanded ? <ExpandUp fill={colors.blue[700]} /> : <ExpandDown fill={colors.blue[700]} />}
        </button>
      </div>

      {expanded && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
              Upload File
            </h3>
            <MediaUploader onFiles={onFiles} />
          </div>

          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
              Fetch from URL
            </h3>
            <div className="flex gap-2">
              <Input
                value={url}
                setValue={(text) => {
                  if (error) setError(null)
                  setUrl(text)
                }}
                placeholder="Enter Media URL"
                selectOnFocus
                onPaste={(e) => e.stopPropagation()}
              />
              <button
                className={`px-4 py-2 font-semibold border rounded transition-colors ${
                  url
                    ? 'border-blue-500 text-blue-600 hover:bg-blue-50'
                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
                onClick={fetchMedia}
                disabled={!url}
              >
                {isLoading ? <img className="w-5 h-5" src={loadingIcon} alt="Loading" /> : 'Fetch'}
              </button>
            </div>
            {progress > 0 && isLoading && (
              <div className="mt-3">
                <ProgressBar progress={progress} />
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="p-3 text-sm text-red-600 rounded-lg bg-red-50">{error.message}</p>}

      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-700">
          {medias.length} {medias.length === 1 ? 'item' : 'items'}
        </h3>
        {medias.length === 0 ? (
          <p className="py-8 text-center text-gray-500">No media added yet</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {medias.toReversed().map((item) => {
              const isApplied = item.id === media?.id

              return (
                <div
                  key={item.id}
                  className={`flex flex-col overflow-hidden border rounded-lg shadow-sm transition-all ${
                    isApplied ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-1 bg-gray-100 aspect-video">
                    <Background
                      media={item}
                      width="100%"
                      height="100%"
                      autoPlay={false}
                      controls={true}
                      className="object-contain"
                    />
                  </div>

                  <div className="flex gap-2 p-3">
                    <button
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium border rounded transition-colors ${
                        isApplied
                          ? 'bg-green-500 text-white border-green-500'
                          : 'text-green-600 border-green-500 hover:bg-green-50'
                      }`}
                      onClick={() => applyMedia(item)}
                    >
                      <Check fill={isApplied ? 'white' : colors.green[500]} />
                      {isApplied ? 'Applied' : 'Apply'}
                    </button>
                    <button
                      className="p-2 text-blue-600 transition-colors border border-blue-500 rounded hover:bg-blue-50"
                      onClick={() => downloadBlob(item.blob, Date.now())}
                      title="Download"
                    >
                      <img className="w-4 h-4" src={downloadIcon} alt="Download" />
                    </button>
                    <button
                      className="p-2 text-red-600 transition-colors border border-red-500 rounded hover:bg-red-50"
                      onClick={() => deleteMedia(item)}
                      title="Delete"
                    >
                      <img className="w-4 h-4" src={deleteIcon} alt="Delete" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MediaSection

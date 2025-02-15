import { fetchMedia } from '../xhr'
import IndexedDBWrapper from './IDB'
import Storage from './Storage'

const settingsStorage = new Storage('settings')
const db = new IndexedDBWrapper('NewTab', 'media', 2, [
  { name: 'urlIndex', keyPath: 'url', options: { unique: true } },
])

async function saveMediaBlob(mediaUrl, onProgress) {
  const blob = await fetchMedia(mediaUrl, onProgress)

  console.log({ blob })

  if (blob.type.startsWith('video') || blob.type.startsWith('image')) {
    const id = await db.add({
      blob,
      url: mediaUrl,
    })

    const media = await db.get(id)

    return media
  } else {
    console.error(`Unsupported type ${blob.type}`, blob, mediaUrl)
    throw new Error('Unable to process media as it is neither an image nor a video.')
  }
}

async function isPermissionsGranted() {
  return await chrome.permissions.contains({
    origins: ['https://*/*'],
  })
}

function isValidURL(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export { db, isPermissionsGranted, isValidURL, saveMediaBlob, settingsStorage }

globalThis['db'] = db
globalThis['settingsStorage'] = settingsStorage

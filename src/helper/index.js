import { fetchMedia } from '../xhr'
import IndexedDBWrapper from './IDB'
import Storage from './Storage'

const settingsStorage = new Storage('settings')
const db = new IndexedDBWrapper('NewTab', 'media', 2, [
  { name: 'urlIndex', keyPath: 'url', options: { unique: true } },
])

async function fetchUrlAndSaveMediaBlob(mediaUrl, onProgress) {
  const blob = await fetchMedia(mediaUrl, onProgress)
  await saveMediaBlob(mediaUrl, blob)
}

async function saveMediaBlob(url, blob) {
  if (blob.type.startsWith('video') || blob.type.startsWith('image')) {
    const id = await db.add({
      blob,
      url,
    })

    const media = await db.get(id)

    return media
  } else {
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

export {
  db,
  fetchUrlAndSaveMediaBlob,
  isPermissionsGranted,
  isValidURL,
  saveMediaBlob,
  settingsStorage,
}

globalThis['db'] = db
globalThis['settingsStorage'] = settingsStorage

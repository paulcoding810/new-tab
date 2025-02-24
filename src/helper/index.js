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
  await validateBlob(blob)

  const id = await db.add({
    blob,
    url,
  })

  const media = await db.get(id)
  return media
}

async function validateBlob(blob) {
  const MAX_BLOB_SIZE = await settingsStorage.get('maxBlobSize')

  if (blob.size > MAX_BLOB_SIZE) {
    throw new Error(
      `The blob size (${bytesToMB(blob.size)}) exceeds the maximum allowed size of ${bytesToMB(MAX_BLOB_SIZE)}.`,
    )
  }
  if (blob.size === 0) {
    throw new Error('Empty blob!')
  }
  if (!blob.type.startsWith('video') && !blob.type.startsWith('image')) {
    throw new Error(
      `Type (${blob.type}) is not supported. It should be either 'video/*' or 'image/*'.`,
    )
  }
  return true
}

async function isUrlDuplicated(url) {
  const foundMedia = await db.getByIndex('urlIndex', url)
  return Boolean(foundMedia)
}

function bytesToMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
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
  bytesToMB,
  db,
  fetchUrlAndSaveMediaBlob,
  isPermissionsGranted,
  isUrlDuplicated,
  isValidURL,
  saveMediaBlob,
  settingsStorage,
  validateBlob,
}

globalThis['db'] = db
globalThis['settingsStorage'] = settingsStorage

import { fetchMedia } from '../xhr'
import IndexedDBWrapper from './IDB'
import Storage from './Storage'

const settingsStorage = new Storage('settings')
const db = new IndexedDBWrapper('NewTab', 'media')

async function saveMediaBlob(mediaUrl, onProgress) {
  const blob = await fetchMedia(mediaUrl, onProgress)

  const id = await db.add({
    blob,
    url: mediaUrl,
  })

  const media = await db.get(id)

  return media
}

async function isPermissionsGranted() {
  return await chrome.permissions.contains({
    origins: ['https://*/*'],
  })
}

export { db, isPermissionsGranted, saveMediaBlob, settingsStorage }

import { fetchVideo } from '../xhr'
import IndexedDBWrapper from './IDB'
import Storage from './Storage'

const settingsStorage = new Storage('settings')
const db = new IndexedDBWrapper('NewTab', 'media')

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

export { db, isPermissionsGranted, saveVideoBlob, settingsStorage }

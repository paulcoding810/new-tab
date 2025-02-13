import { fetchMedia } from '../xhr'
import IndexedDBWrapper from './IDB'
import Storage from './Storage'

const settingsStorage = new Storage('settings')
const db = new IndexedDBWrapper('NewTab', 'media')

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

export { db, isPermissionsGranted, saveMediaBlob, settingsStorage }

globalThis['db'] = db
globalThis['settingsStorage'] = settingsStorage

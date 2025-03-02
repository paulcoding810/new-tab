import { db, isUrlDuplicated, settingsStorage, validateBlob } from '../helper'
import { hideLoading, showError, showLoading, showSuccess } from './scripts'

chrome.runtime.onInstalled.addListener(async () => {
  console.log('background has been installed')
  const initialized = await settingsStorage.get('initialized')
  if (initialized) {
    return
  }

  const url = chrome.runtime.getURL('img/cat.jpeg')
  try {
    const blob = await (await fetch(url)).blob()
    const id = await db.add({ blob, url })

    // init settingsStorage with default values
    await settingsStorage.setValue({
      mediaId: id,
      blur: 0,
      showsTime: true,
      initialized: true,
      maxBlobSize: 52_428_800, // 50MB in bytes
      showsWeather: false,
      weatherApiKey: null,
      coords: null,
      weatherUnit: 'C',
    })
  } catch (error) {
    console.error('Failed to init data', error)
  }
})

chrome.action.onClicked.addListener((tab) => {
  const url = chrome.runtime.getURL('options.html')
  chrome.tabs.create({ url })
})

chrome.contextMenus.create({
  id: 'set-background',
  title: 'Set as NewTab background',
  contexts: ['image', 'video'],
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  switch (info.menuItemId) {
    case 'set-background':
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: showLoading,
      })
      try {
        const url = info.srcUrl

        if (!url) throw new Error('No srcUrl')
        if (await isUrlDuplicated(url)) throw new Error('Item already exists!')

        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`)

        const blob = await response.blob()
        await validateBlob(blob)

        const id = await db.add({ blob, url: url })
        await settingsStorage.set('mediaId', id)
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: showSuccess,
        })
      } catch (error) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: showError,
          args: [error.message],
        })
      } finally {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: hideLoading,
        })
      }
      break
    default:
      break
  }
})

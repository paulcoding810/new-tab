import { db, settingsStorage } from '../helper'
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

    await settingsStorage.setValue({
      mediaId: id,
      blur: 0,
      showsTime: true,
      initialized: true,
    })
  } catch (error) {
    console.error('Failed to init data', error)
  }
})

chrome.action.onClicked.addListener((tab) => {
  const url = chrome.runtime.getURL('options.html')
  chrome.tabs.create({ url: 'options.html' })
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
        // TODO: Check if url existed
        const blob = await (await fetch(info.srcUrl)).blob()
        const id = await db.add({ blob, url: info.srcUrl })
        await settingsStorage.set('mediaId', id)
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: showSuccess,
        })
      } catch (error) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: showError,
          args: [error],
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

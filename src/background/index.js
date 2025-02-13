import { db, settingsStorage } from '../helper'

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
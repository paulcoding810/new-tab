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
    const id = db.add({ blob, url })
    await settingsStorage.set('mediaId', id)
    await settingsStorage.set('blur', 0)
    await settingsStorage.set('showsTime', true)
    await settingsStorage.set('initialized', true)
  } catch (error) {
    console.error('Failed to init data', error)
  }
})

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'options.html' })
})
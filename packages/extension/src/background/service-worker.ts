chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({ text: 'ON' })
})

chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    })
})

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    if (msg.action === 'ping') {
        sendResponse({ status: 'ready' })
    }
})
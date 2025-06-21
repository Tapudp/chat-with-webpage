const allTagsToRemove = 'script, style, nav, footer'
function extractPageContent() {
    const elementsToRemove = Array.from(document.querySelectorAll(allTagsToRemove))
    elementsToRemove.forEach(el => el.remove())

    return document.body.innerText
        .replace(/\s+/g, ' ')
        .replace(/[\n\r]+/g, '\n')
        .trim()
}

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action === 'getPageContent') {
        sendResponse({ content: extractPageContent() })
    }
})

chrome.runtime.sendMessage({ action: 'ping' }, (response) => {
    if (!response) {
        console.log('No background script response - is it registered?')
    }
})
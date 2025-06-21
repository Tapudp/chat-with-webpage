export const fetchPageContent = async (url: string): Promise<string> => {
    const response = await fetch('http://localhost:3001/api/fetch-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    })

    const { content } = await response.json()
    return content
}

export const sendChatMessage = async (messages: any[], pageContent: string) => {
    const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, pageContent })
    })

    return response
}
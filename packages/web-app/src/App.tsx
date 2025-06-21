import { useState } from 'react'
import './App.css'
import type { ChatMessage } from '@chat-with-webpage/ui'
import { Chat, UrlInput } from '@chat-with-webpage/ui'
import { fetchPageContent, sendChatMessage } from './utility'

function App() {
  const [url, setUrl] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pageContent, setPageContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmitUrl = async (url: string) => {
    setIsLoading(true)
    try {
      const content = await fetchPageContent(url)
      setPageContent(content)
      setUrl(url)
    } catch (error) {
      alert(`Failed to fetch page: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!url || !pageContent) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
    }

    setMessages((prev) => [...prev, userMessage])

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: '',
    }

    setMessages((prev) => [...prev, assistantMessage])

    try {
      const response = await sendChatMessage(
        [...messages, { role: 'user', content: message }],
        pageContent
      )

      if (!response.ok) throw new Error('Chat failed')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader')

      let assistantContent = ''
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        let chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = JSON.parse(line.replace('data: ', ''))
            assistantContent += data.content
            setMessages((prev) => {
              const newMessages = [...prev]
              newMessages[newMessages.length - 1].content = assistantContent
              return newMessages
            })
          }
        }
      }
    } catch (error) {
      console.error('Chat error: ', error)
      setMessages((prev) => [...prev.slice(0, -1)])
    }
  }

  return (
    <>
      <div className="app-container">
        {!url ? (
          <UrlInput onSubmit={handleSubmitUrl} isLoading={isLoading} />
        ) : (
          <Chat messages={messages} onSend={handleSendMessage} pageContent={pageContent} />
        )}
      </div>
    </>
  )
}

export default App

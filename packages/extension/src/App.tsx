import { useState, useEffect } from 'react'
import { Chat } from '@chat-with-webpage/ui'
import type { ChatMessage } from '@chat-with-webpage/ui'
import './App.css'

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pageContent, setPageContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get current page content when popup opens
  useEffect(() => {
    const fetchCurrentPageContent = async () => {
      setIsLoading(true)
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

        if (!tab?.id) {
          throw new Error('No active tab found')
        }

        // Send message to content script
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: 'getPageContent',
        })

        if (!response?.content) {
          throw new Error('Failed to extract page content')
        }

        setPageContent(response.content)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentPageContent()
  }, [])

  const handleSendMessage = async (message: string) => {
    if (!pageContent) return

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
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          pageContent,
        }),
      })

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
      console.error('Chat error:', error)
      setMessages((prev) => [...prev.slice(0, -1)])
      setError('Failed to send message')
    }
  }

  if (error) {
    return (
      <div className="popup-container error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.close()}>Close</button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="popup-container loading">
        <p>Analyzing page content...</p>
      </div>
    )
  }

  return (
    <div className="popup-container">
      <Chat
        messages={messages}
        onSend={handleSendMessage}
        pageContent={pageContent}
        isExtension={true}
      />
    </div>
  )
}

export default App

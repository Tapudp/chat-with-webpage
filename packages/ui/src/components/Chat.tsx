import { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '../types'
import { SuggestedQuestions } from './SuggestedQuestions'
import { Message } from './Message'

interface ChatProps {
  messages: ChatMessage[]
  onSend: (message: string) => void
  pageContent: string
  isExtension?: boolean
}

export function Chat({ messages, onSend, pageContent, isExtension }: ChatProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSend(input)
      setInput('')
    }
  }

  return (
    <div className={`chat-container ${isExtension ? 'extension' : ''}`}>
      <div className="messages">
        {messages.length !== 0 ? (
          messages.map((message, i) => <Message key={i} message={message} />)
        ) : (
          <div className="start-chat">Please ask questions to initiate the conversation?</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <SuggestedQuestions content={pageContent} onSelect={onSend} />

      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this page..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

import { ChatMessage } from '../types'

interface MessageProps {
  message: ChatMessage
}

export function Message({ message }: MessageProps) {
  return (
    <div className={`message ${message.role}`}>
      <div className="message-role">{message.role}:</div>
      <div className="message-content">{message.content}</div>
    </div>
  )
}

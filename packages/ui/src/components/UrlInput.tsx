import { useState } from 'react'

interface UrlInputProps {
  onSubmit: (url: string) => void
  isLoading: boolean
}

export function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSubmit(url)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="url-input-form">
      <h1>Chat with Webpage</h1>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter webpage URL"
        required
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading . . .' : 'Start Chat'}
      </button>
    </form>
  )
}

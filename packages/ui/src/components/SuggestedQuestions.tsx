import { useState, useEffect } from 'react'

interface SuggestedQuestionsProps {
  content: string
  onSelect: (question: string) => void
}

const DEFAULT_QUESTIONS: string[] = [
  'What is this page about?',
  'Can you summarize the key points?',
  'Are there any important dates mentioned?',
]

export function SuggestedQuestions({ content, onSelect }: SuggestedQuestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_QUESTIONS)

  // In a real app, might generate these from the content
  useEffect(() => {
    if (content) {
      // This would call an LLM in production to generate questions
      setSuggestions([
        ...DEFAULT_QUESTIONS,
        'What are the main topics discussed?',
        'Does this mention any specific products or services?',
      ])
    }
  }, [content])

  return (
    <div className="suggested-questions">
      {suggestions.map((question, i) => (
        <button key={i} onClick={() => onSelect(question)} className="suggestion-button">
          {question}
        </button>
      ))}
    </div>
  )
}

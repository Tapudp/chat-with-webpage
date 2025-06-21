import express from 'express'
import cors from 'cors'
import { fetchPageContent } from './fetcher'
import { OpenAIService } from './openai'
import { ChatCompletionMessageParam } from 'openai/resources'
import 'dotenv/config'

const openaiService = new OpenAIService({
    apiKey: process.env.OPENAI_API_KEY || ''
})

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Proxy endpoint for fetching webpage content
app.post('/api/fetch-content', async (req, res) => {
    try {
        const { url } = req.body
        if (!url) {
            return res.status(400).json({ error: 'URL is required' })
        }

        const content = await fetchPageContent(url)
        res.json({ content })
    } catch (error) {
        console.error('Fetch error: ', error)
        res.status(500).json({ error: 'Failed to fetch content' })
    }
})

app.get('/health', (req, res) => {
    res.send('OK')
})

app.post('/api/chat', async (req, res) => {
    try {
        const { messages, pageContent }: { messages: ChatCompletionMessageParam[], pageContent: string } = req.body

        if (!messages || !pageContent) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        const fullMessages: ChatCompletionMessageParam[] = [
            {
                role: 'system',
                content: `You are a helpful assistant that answers questions about webpage content. 
        If the question is unrelated, respond: "This question is outside the scope of the current webpage."
        Webpage content: ${pageContent}`
            },
            ...messages
        ]

        const stream = await openaiService.createChatCompletion(fullMessages, true)

        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta.content || ''
            res.write(`data: ${JSON.stringify({ content })}\n\n`)
        }

        res.end()
    } catch (error) {
        console.error('Chat error: ', error)
        res.status(500).json({ error: 'Failed to process chat' })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
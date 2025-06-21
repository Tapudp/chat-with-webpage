import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources'

interface ChatWithPageOptions {
    apiKey: string
    model?: string
    maxTokens?: number
    temperature?: number
}

export class OpenAIService {
    private openai: OpenAI
    private defaultModel = 'gpt-3.5-turbo'
    private defaultMaxTokens = 1000
    private defaultTemperature = 0.7

    constructor(private options: ChatWithPageOptions) {
        this.openai = new OpenAI({
            apiKey: options.apiKey
        })
    }

    async createChatCompletion(
        messages: ChatCompletionMessageParam[],
        stream = true
    ) {
        return this.openai.chat.completions.create({
            model: this.options.model || this.defaultModel,
            messages,
            max_tokens: this.options.maxTokens || this.defaultMaxTokens,
            temperature: this.options.temperature || this.defaultTemperature,
            stream
        })
    }
}
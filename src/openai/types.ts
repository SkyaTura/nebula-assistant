import { ChatCompletionRequestMessage, CreateChatCompletionRequest, CreateChatCompletionResponse, OpenAIApi } from 'openai'

export interface OpenAIConfig {
  apiKey: string
  chatDefaults: Partial<Omit<CreateChatCompletionRequest, 'messages'>>
}

export interface OpenAIModule {
  api: OpenAIApi
  chatGPT: (messages: ChatCompletionRequestMessage[], options?: OpenAIConfig['chatDefaults']) => Promise<CreateChatCompletionResponse | null>
}

export { OpenAIApi, CreateChatCompletionRequest, CreateChatCompletionResponse } from 'openai'
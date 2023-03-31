export interface NLP {
  process: (text: string) => Promise<{
    utterance: string
    intent: string
    score: number
    answer?: string
    [key: string]: any
  }>;
}
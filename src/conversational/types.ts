export interface ConversationalRequest {
  text: string
}

export interface ConversationalResponse {
  text: string
}

export interface ConversationalProcess {
  (input: ConversationalRequest, engines?: string[]): Promise<ConversationalResponse | null>
}

export interface ConversationalModule {
  process: ConversationalProcess
}
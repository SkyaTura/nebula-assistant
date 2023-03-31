import { FastifyInstance } from 'fastify'

export interface RestAPIConfig {
  port: number
  host: string
  logger: boolean
}

export interface RestAPIModule {
  server: FastifyInstance
}
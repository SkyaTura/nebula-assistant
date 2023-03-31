import fastify from "fastify"
import { AppModule } from "../types"

export const setupRestAPI: AppModule = async ctx => {
  const log = ctx.logger('restapi')
  const config = ctx.config.load('restapi', {
    port: parseInt(process.env.REST_PORT ?? '9000', 10),
    host: process.env.REST_HOST ?? '0.0.0.0',
    logger: process.env.REST_LOGGER === 'true',
  })
  const server = fastify({ logger: config.logger })

  server.get('/', (_req, reply) => reply.header('Content-Type', 'text/html').send(`<meta charset="UTF-8"><div style="font-size: 25vh; text-align: center">🥸</div>`))

  server.post('/chat/process', async (req, reply) => {
    const answer = await ctx.conversational.process(req.body as any, (req.query as any).engines?.split(','))
    reply.send(answer)
  })

  const address = await server.listen({ port: config.port, host: config.host })
  log.get('server').notice('Server listening on %j', address)
  log.notice('RestAPI setup complete!')
}
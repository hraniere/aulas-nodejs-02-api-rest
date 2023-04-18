/* eslint-disable @typescript-eslint/no-floating-promises */
import fastify from 'fastify'
import { transactionRoutes } from './routes/transactions'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyCookie)
app.register(transactionRoutes, {
  prefix: '/transactions'
})

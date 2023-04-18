/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/auth'

export async function transactionRoutes (app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', async (req, res) => {
    if (req.method !== 'POST') {
      await checkSessionIdExists(req, res)
    }
  })

  app.get('/', async (req, res) => {
    const transactions = await knex('transactions').where('session_id', req.cookies.sessionId).select()

    return { transactions }
  })

  app.get('/:id', async (req) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid()
    })
    const { id } = getTransactionParamsSchema.parse(req.params)

    const transaction = await knex('transactions')
      .where('id', id)
      .where('session_id', req.cookies.sessionId)
      .first()

    return { transaction }
  })

  app.get('/summary', async (req) => {
    const summary = await knex('transactions')
      .where('session_id', req.cookies.sessionId)
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })

  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit'])
    })

    const body = createTransactionBodySchema.parse(req.body)
    const { title, amount, type } = body

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      void res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      })
    }

    const transaction = await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : -1 * amount,
      session_id: sessionId
    }).returning('*')
    return await res.status(201).send(transaction)
  })
}

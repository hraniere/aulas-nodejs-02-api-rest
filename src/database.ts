import { knex as buildKnex, type Knex } from 'knex'
import { env } from './env'

export const knexConfig: Knex.Config = {
  client: 'sqlite',
  useNullAsDefault: true,
  connection: {
    filename: env.DATABASE_URL
  },
  migrations: {
    directory: './db/migrations',
    extension: 'ts'
  }
}

export const knex = buildKnex(knexConfig)

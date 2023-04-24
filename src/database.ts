import { knex as buildKnex, type Knex } from 'knex'
import { env } from './env'

export const knexConfig: Knex.Config = {
  client: env.DATABASE_CLIENT,
  useNullAsDefault: true,
  connection: env.DATABASE_CLIENT === 'sqlite'
    ? {
        filename: env.DATABASE_URL
      }
    : env.DATABASE_URL,
  migrations: {
    directory: './db/migrations',
    extension: 'ts'
  }
}

export const knex = buildKnex(knexConfig)

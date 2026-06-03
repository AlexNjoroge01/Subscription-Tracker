import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http'

type Schema = typeof schema

let _db: NeonHttpDatabase<Schema> | undefined

function getDb(): NeonHttpDatabase<Schema> {
  if (!_db) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL environment variable is not set')
    const sql = neon(url)
    _db = drizzle({ client: sql, schema })
  }
  return _db
}

export const db: NeonHttpDatabase<Schema> = new Proxy({} as NeonHttpDatabase<Schema>, {
  get(_, prop: string | symbol) {
    return Reflect.get(getDb(), prop)
  },
})

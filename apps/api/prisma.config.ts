import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://rentofluencer:dev_password_123@localhost:5432/rentofluencer' })
const adapter = new PrismaPg(pool)

export default defineConfig({
  schema: '../../prisma/schema.prisma',
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://rentofluencer:dev_password_123@localhost:5432/rentofluencer'
    }
  },
  adapter: adapter
})
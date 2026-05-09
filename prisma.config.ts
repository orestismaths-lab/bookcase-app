import path from 'node:path'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { defineConfig } = require('prisma/config')

module.exports = defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    async adapter() {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PrismaLibSql } = require('@prisma/adapter-libsql')
      const url = process.env.TURSO_DATABASE_URL ?? `file://${path.join(process.cwd(), 'dev.db')}`
      const authToken = process.env.TURSO_AUTH_TOKEN
      return new PrismaLibSql({ url, authToken })
    },
  },
  datasource: {
    url: `file://${path.join(process.cwd(), 'dev.db')}`,
  },
})

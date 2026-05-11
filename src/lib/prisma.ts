import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  let url = process.env.TURSO_DATABASE_URL ?? `file://${path.join(process.cwd(), 'dev.db')}`
  // Serverless environments need HTTP, not WebSocket — convert libsql:// → https://
  if (url.startsWith('libsql://')) url = url.replace('libsql://', 'https://')
  const authToken = process.env.TURSO_AUTH_TOKEN
  const adapter = new PrismaLibSql({ url, authToken })
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

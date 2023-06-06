import type { ResponseConfig } from '@asteasolutions/zod-to-openapi'

export const create401ResponseSchema = (): ResponseConfig => {
  return {
    description: '401 Unauthorized',
  }
}

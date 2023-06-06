import type { ResponseConfig } from '@asteasolutions/zod-to-openapi'
import { UNAUTHORIZED } from 'src/constants'
import { z } from 'zod'

export const create401ResponseSchema = (): ResponseConfig => {
  return {
    description: '401 Unauthorized',
    content: {
      'application/json': {
        schema: z
          .object({
            message: z.string().openapi({ example: 'Unauthorized' }),
            statusCode: z.literal('401'),
          })
          .openapi(UNAUTHORIZED),
      },
    },
  }
}

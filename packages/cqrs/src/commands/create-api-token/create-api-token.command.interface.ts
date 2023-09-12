import type { z } from 'zod'
import type { createApiTokenCommandInput } from './create-api-token.command.input.js'

export type ICreateApiTokenCommandInput = z.infer<typeof createApiTokenCommandInput>

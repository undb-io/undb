import type { z } from 'zod'
import type { deleteApiTokenCommandInput } from './delete-api-token.command.input.js'

export type IDeleteApiTokenCommandInput = z.infer<typeof deleteApiTokenCommandInput>

import type { z } from 'zod'
import type { creawteFieldCommandInput } from './create-field.command.input'

export type ICreateFieldCommandInput = z.infer<typeof creawteFieldCommandInput>

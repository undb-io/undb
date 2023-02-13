import type * as z from 'zod'
import type { updateOptionCommandInput } from './update-option.command.input.js'

export type IUpdateOptionCommandInput = z.infer<typeof updateOptionCommandInput>

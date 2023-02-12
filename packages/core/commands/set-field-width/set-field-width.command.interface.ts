import type { z } from 'zod'
import type { setFieldWidthCommandInput } from './set-field-width.command.input.js'

export type ISetFieldWidthCommandInput = z.infer<typeof setFieldWidthCommandInput>

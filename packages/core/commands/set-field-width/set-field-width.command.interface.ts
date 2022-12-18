import type { z } from 'zod'
import type { setFieldWidthCommandInput } from './set-field-width.command.input'

export type ISetFieldWidthCommandInput = z.infer<typeof setFieldWidthCommandInput>

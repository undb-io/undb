import type { z } from 'zod'
import type { setFormFieldsOrderCommandInput } from './set-form-fields-order.command.input.js'

export type ISetFormFieldsOrderCommandInput = z.infer<typeof setFormFieldsOrderCommandInput>

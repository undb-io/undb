import type { z } from 'zod'
import type { setFormFieldFilterCommandInput } from './set-form-field-filter.command.input.js'

export type ISetFormFieldFilterCommandInput = z.infer<typeof setFormFieldFilterCommandInput>

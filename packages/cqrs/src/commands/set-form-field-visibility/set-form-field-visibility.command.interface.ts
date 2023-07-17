import type { z } from 'zod'
import type { setFormFieldVisibilityCommandInput } from './set-form-field-visibility.command.input.js'

export type ISetFormFieldVisibilityCommandInput = z.infer<typeof setFormFieldVisibilityCommandInput>

import type { z } from 'zod'
import type { setFormFieldRequirementsCommandInput } from './set-form-field-requirements.command.input.js'

export type ISetFormFieldRequirementsCommandInput = z.infer<typeof setFormFieldRequirementsCommandInput>

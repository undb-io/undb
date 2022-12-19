import type { z } from 'zod'
import type { setFieldVisibilityCommandInput } from './set-field-visibility.command.input'

export type ISetFieldVisibilityCommandInput = z.infer<typeof setFieldVisibilityCommandInput>

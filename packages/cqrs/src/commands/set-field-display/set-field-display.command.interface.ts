import type { z } from 'zod'
import type { setFieldDisplaysCommandInput } from './set-field-display.command.input.js'

export type ISetFieldDisplayCommandInput = z.infer<typeof setFieldDisplaysCommandInput>

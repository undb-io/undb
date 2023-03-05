import type { z } from 'zod'
import type { setShowSystemFieldssCommandInput } from './set-show-system-fields.command.input.js'

export type ISetShowSystemFieldsCommandInput = z.infer<typeof setShowSystemFieldssCommandInput>

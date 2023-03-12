import type { z } from 'zod'
import type { setPinnedFieldsCommandInput } from './set-pinned-fields.command.input.js'

export type ISetPinnedFieldsCommandInput = z.infer<typeof setPinnedFieldsCommandInput>

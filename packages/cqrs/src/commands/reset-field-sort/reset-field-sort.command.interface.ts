import type { z } from 'zod'
import type { resetFieldSortsCommandInput } from './reset-field-sort.command.input.js'

export type IResetFieldSortCommandInput = z.infer<typeof resetFieldSortsCommandInput>

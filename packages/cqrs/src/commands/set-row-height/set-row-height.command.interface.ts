import type { z } from 'zod'
import type { setRowHeightCommandInput } from './set-row-height.command.input.js'

export type ISetRowHeightCommandInput = z.infer<typeof setRowHeightCommandInput>

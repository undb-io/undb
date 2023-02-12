import type { z } from 'zod'
import type { reorderOptionsCommandInput } from './reorder-options.command.input.js'

export type IReorderOptionsCommandInput = z.infer<typeof reorderOptionsCommandInput>

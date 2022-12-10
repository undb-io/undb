import type { z } from 'zod'
import type { setFiltersCommandInput } from './set-filters.command.input'

export type ISetFilterCommandInput = z.infer<typeof setFiltersCommandInput>

import type { z } from 'zod'
import type { setKanbanFieldCommandInput } from './set-kanban-field.command.input.js'

export type ISetKanbanFieldCommandInput = z.infer<typeof setKanbanFieldCommandInput>

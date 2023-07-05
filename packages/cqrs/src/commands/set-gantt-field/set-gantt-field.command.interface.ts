import type { z } from 'zod'
import type { setGanttFieldCommandInput } from './set-gantt-field.command.input.js'

export type ISetGanttFieldCommandInput = z.infer<typeof setGanttFieldCommandInput>

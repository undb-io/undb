import type { z } from 'zod'
import type { setCalendarFieldCommandInput } from './set-calendar-field.command.input.js'

export type ISetCalendarFieldCommandInput = z.infer<typeof setCalendarFieldCommandInput>

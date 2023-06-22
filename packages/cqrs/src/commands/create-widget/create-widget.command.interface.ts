import type { z } from 'zod'
import type { createWidgetCommandInput } from './create-widget.command.input.js'

export type ICreateWidgetCommandInput = z.infer<typeof createWidgetCommandInput>

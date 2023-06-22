import type { z } from 'zod'
import type { deleteWidgetCommandInput } from './delete-widget.command.input.js'

export type IDeleteWidgetCommandInput = z.infer<typeof deleteWidgetCommandInput>

import type { z } from 'zod'
import type { updateVisualizationCommandInput } from './update-visualization.command.input.js'

export type IUpdateVisualizationCommandInput = z.infer<typeof updateVisualizationCommandInput>

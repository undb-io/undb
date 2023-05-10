import type { z } from 'zod'
import type { updateVirsualizationCommandInput } from './update-virsualization.command.input.js'

export type IUpdateVirsualizationCommandInput = z.infer<typeof updateVirsualizationCommandInput>

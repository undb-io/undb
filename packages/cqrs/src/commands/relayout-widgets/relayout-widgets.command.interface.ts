import type { z } from 'zod'
import type { relayoutWidgetsCommandInput } from './relayout-widgets.command.input.js'

export type IRelayoutWidgetsCommandInput = z.infer<typeof relayoutWidgetsCommandInput>

import type { z } from 'zod'
import type { relayoutWidgesCommandInput } from './relayout-widges.command.input.js'

export type IRelayoutWidgesCommandInput = z.infer<typeof relayoutWidgesCommandInput>

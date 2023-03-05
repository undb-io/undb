import type { z } from 'zod'
import type { updateViewNameCommandInput } from './udpate-view-name.command.input.js'

export type IUpdateViewNameCommandInput = z.infer<typeof updateViewNameCommandInput>

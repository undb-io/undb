import type { z } from 'zod'
import type { updateShareCommandInput } from './update-share.command.input.js'

export type IUpdateShareCommandInput = z.infer<typeof updateShareCommandInput>

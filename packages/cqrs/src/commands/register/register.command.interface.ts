import type { z } from 'zod'
import type { registerCommandInput } from './register.command.input.js'
import { registerCommandOutput } from './register.command.output.js'

export type IRegisterCommandInput = z.infer<typeof registerCommandInput>
export type IRegisterCommandOutput = z.infer<typeof registerCommandOutput>

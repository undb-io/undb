import type { z } from 'zod'
import type { loginCommandInput } from './login.command.input.js'
import { loginCommandOutput } from './login.command.output.js'

export type ILoginCommandInput = z.infer<typeof loginCommandInput>
export type ILoginCommandOutput = z.infer<typeof loginCommandOutput>

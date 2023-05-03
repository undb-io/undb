import type { z } from 'zod'
import type { updateProfileCommandInput } from './update-profile.command.input.js'
import { updateProfileCommandOutput } from './update-profile.command.output.js'

export type IUpdateProfileCommandInput = z.infer<typeof updateProfileCommandInput>
export type IUpdateProfileCommandOutput = z.infer<typeof updateProfileCommandOutput>

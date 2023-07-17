import type { z } from 'zod'
import type { createFormFromViewCommandInput } from './create-form-from-view.command.input.js'

export type ICreateFormFromViewCommandInput = z.infer<typeof createFormFromViewCommandInput>

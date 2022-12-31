import type { z } from 'zod'
import type { switchDisplayTypeCommandInput } from './switch-display-type.command.input'

export type ISwitchDisplayTypeCommandInput = z.infer<typeof switchDisplayTypeCommandInput>

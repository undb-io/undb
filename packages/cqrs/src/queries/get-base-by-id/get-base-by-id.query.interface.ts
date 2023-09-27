import type * as z from 'zod'
import type { getBaseByIdQueryInput } from './get-base-by-id.query.input.js'
import type { getBaseByIdQueryOutput } from './get-base-by-id.query.output.js'

export type IGetBaseByIdQuery = z.infer<typeof getBaseByIdQueryInput>
export type IGetBaseByIdOutput = z.infer<typeof getBaseByIdQueryOutput>

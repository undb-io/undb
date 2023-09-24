import type * as z from 'zod'
import type { getBasesQueryInput } from './get-bases.query.input.js'
import type { getBasesQueryOutput } from './get-bases.query.output.js'

export type IGetBasesQuery = z.infer<typeof getBasesQueryInput>
export type IGetBasesOutput = z.infer<typeof getBasesQueryOutput>

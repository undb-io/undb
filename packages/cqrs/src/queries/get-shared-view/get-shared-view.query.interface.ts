import type * as z from 'zod'
import type { getSharedViewQueryInput } from './get-shared-view.query.input.js'
import type { getSharedViewQueryOutput } from './get-shared-view.query.output.js'

export type IGetSharedViewQuery = z.infer<typeof getSharedViewQueryInput>
export type IGetSharedViewOutput = z.infer<typeof getSharedViewQueryOutput>

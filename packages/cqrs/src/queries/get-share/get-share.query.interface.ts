import type * as z from 'zod'
import type { getShareQueryInput } from './get-share.query.input.js'
import type { getShareQueryOutput } from './get-share.query.output.js'

export type IGetShareQuery = z.infer<typeof getShareQueryInput>
export type IGetShareOutput = z.infer<typeof getShareQueryOutput>

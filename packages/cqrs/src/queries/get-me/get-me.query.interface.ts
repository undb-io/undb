import type * as z from 'zod'
import type { getMeQueryOutput } from './get-me.query.output.js'
import type { getMeQuerySchema } from './get-me.query.schema.js'

export type IGetMeQuery = z.infer<typeof getMeQuerySchema>
export type IGetMeOutput = z.infer<typeof getMeQueryOutput>

import type * as z from 'zod'
import type { getMembersQueryOutput } from './get-members.query.output.js'
import type { getMembersQuerySchema } from './get-members.query.schema.js'

export type IGetMembersQuery = z.infer<typeof getMembersQuerySchema>
export type IGetMembersOutput = z.infer<typeof getMembersQueryOutput>

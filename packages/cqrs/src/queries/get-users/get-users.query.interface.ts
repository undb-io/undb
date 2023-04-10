import type * as z from 'zod'
import type { getUsersQueryOutput } from './get-uesrs.query.output.js'
import type { getUsersQuerySchema } from './get-users.query.schema.js'

export type IGetUsersQuery = z.infer<typeof getUsersQuerySchema>
export type IGetUsersOutput = z.infer<typeof getUsersQueryOutput>

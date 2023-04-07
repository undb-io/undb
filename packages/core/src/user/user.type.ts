import type { z } from 'zod'
import type { queryUser } from './user.schema'

export type IQueryUser = z.infer<typeof queryUser>

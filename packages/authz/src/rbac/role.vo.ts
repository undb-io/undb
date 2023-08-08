import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const roles = z.enum(['owner', 'admin', 'viewer'])

export type IRoles = z.infer<typeof roles>

export class Role extends ValueObject<IRoles> {}

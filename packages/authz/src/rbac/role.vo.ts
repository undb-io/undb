import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const roles = z.enum(['owner', 'admin', 'editor', 'viewer'])
export const rolesWithoutOwner = roles.exclude(['owner'])

export type IRoles = z.infer<typeof roles>
export type IRolesWithoutOwner = z.infer<typeof rolesWithoutOwner>

export class Role extends ValueObject<IRoles> {
  static owner() {
    return new this({ value: 'owner' })
  }

  static fromString(role: string): Role {
    return new this({ value: roles.parse(role) })
  }

  static fromStringWithoutOwner(role: string): Role {
    return new this({ value: rolesWithoutOwner.parse(role) })
  }
}

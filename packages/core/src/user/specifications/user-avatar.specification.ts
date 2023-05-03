import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { User } from '../user.js'
import type { IUserSpecVisitor } from './interface.js'

export class WithUserAvatar extends CompositeSpecification<User, IUserSpecVisitor> {
  constructor(public readonly avatar?: string | null) {
    super()
  }

  static fromNullableString(avatar?: string | null): WithUserAvatar {
    return new WithUserAvatar(avatar)
  }

  isSatisfiedBy(t: User): boolean {
    return this.avatar === t.avatar
  }

  mutate(t: User): Result<User, string> {
    t.avatar = this.avatar
    return Ok(t)
  }

  accept(v: IUserSpecVisitor): Result<void, string> {
    v.avatarEqual(this)
    return Ok(undefined)
  }
}

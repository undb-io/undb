import { and } from '@undb/domain'
import type { UserSpecification } from './specifications/index.js'
import { WithUserAvatar, WithUserEmail, WithUserId, WithUserPassword, WithUsername } from './specifications/index.js'
import { User } from './user'
import type { IUnsafeCreateUser } from './user.type.js'

export class UserFactory {
  static create(...specs: UserSpecification[]): User {
    return and(...specs)
      .unwrap()
      .mutate(User.empty())
      .unwrap()
  }

  static unsafeCreate(input: IUnsafeCreateUser): User {
    return this.create(
      WithUserEmail.fromString(input.email),
      WithUserId.fromString(input.userId),
      WithUserPassword.fromString(input.password),
      WithUsername.fromString(input.username),
      WithUserAvatar.fromNullableString(input.avatar),
    )
  }
}

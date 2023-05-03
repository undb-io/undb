import { and } from '@undb/domain'
import { isNull, isString } from 'lodash-es'
import type { Option } from 'oxide.ts'
import type { UserSpecification } from './specifications'
import { WithUserAvatar, WithUsername } from './specifications'
import type { IQueryUser } from './user.type'
import type { UserId } from './value-objects/index.js'

export class User {
  public userId!: UserId
  public username!: string
  public avatar?: string | null
  public email!: string
  public password!: string

  static empty() {
    return new User()
  }

  public updateProfile(profile: { username?: string; avatar?: string | null }): Option<UserSpecification> {
    const specs: UserSpecification[] = []
    if (isString(profile.username)) {
      specs.push(WithUsername.fromString(profile.username))
    }
    if (isString(profile.avatar) || isNull(profile.avatar)) {
      specs.push(WithUserAvatar.fromNullableString(profile.avatar))
    }

    return and(...specs)
  }

  public toQuery(): IQueryUser {
    return {
      userId: this.userId.value,
      username: this.username,
      email: this.email,
      avatar: this.avatar,
    }
  }
}

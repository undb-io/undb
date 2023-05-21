import { and } from '@undb/domain'
import { isNull, isString } from 'lodash-es'
import type { Option } from 'oxide.ts'
import type { IColor } from '../common/color.js'
import type { UserSpecification } from './specifications/index.js'
import { WithUserAvatar, WithUserColor, WithUsername } from './specifications/index.js'
import type { IQueryUser } from './user.type.js'
import type { UserId } from './value-objects/index.js'

export class User {
  public userId!: UserId
  public username!: string
  public avatar?: string | null
  public email!: string
  public password!: string
  public color!: IColor

  static empty() {
    return new User()
  }

  public updateProfile(profile: {
    username?: string
    avatar?: string | null
    color?: IColor
  }): Option<UserSpecification> {
    const specs: UserSpecification[] = []
    if (isString(profile.username)) {
      specs.push(WithUsername.fromString(profile.username))
    }
    if (isString(profile.avatar) || isNull(profile.avatar)) {
      specs.push(WithUserAvatar.fromNullableString(profile.avatar))
    }
    if (isString(profile.color)) {
      specs.push(WithUserColor.fromString(profile.color))
    }

    return and(...specs)
  }

  public toQuery(): IQueryUser {
    return {
      userId: this.userId.value,
      username: this.username,
      email: this.email,
      avatar: this.avatar,
      color: this.color,
    }
  }
}

import type { CompositeSpecification } from '@undb/domain'
import type { User } from '../user.js'
import type { WithUserAvatar } from './user-avatar.specification.js'
import type { WithUserColor } from './user-color.js'
import type { WithUserEmail } from './user-email.specification.js'
import type { WithUserId, WithUserIds } from './user-id.specification.js'
import type { WithUsername } from './username.specification.js'

export interface IUserSpecVisitor {
  idEqual(s: WithUserId): void
  idsIn(s: WithUserIds): void
  avatarEqual(s: WithUserAvatar): void
  emailEqual(s: WithUserEmail): void
  usernameEqual(s: WithUsername): void
  colorEqual(s: WithUserColor): void
  or(left: UserSpecification, right: UserSpecification): IUserSpecVisitor
  not(): IUserSpecVisitor
}

export type UserSpecification = CompositeSpecification<User, IUserSpecVisitor>

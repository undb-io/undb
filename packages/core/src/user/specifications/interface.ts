import type { CompositeSpecification } from '@undb/domain'
import type { User } from '../user.js'
import type { WithUserEmail } from './user-email.specification.js'
import type { WithUserId } from './user-id.specification.js'
import type { WithUsername } from './username.specification.js'

export interface IUserSpecVisitor {
  idEqual(s: WithUserId): void
  emailEqual(s: WithUserEmail): void
  usernameEqual(s: WithUsername): void
  not(): IUserSpecVisitor
}

export type UserSpecification = CompositeSpecification<User, IUserSpecVisitor>

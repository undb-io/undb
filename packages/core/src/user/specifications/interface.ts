import type { CompositeSpecification } from '@egodb/domain'
import type { User } from '../user.js'
import type { WithUserEmail } from './user-email.specification.js'

export interface IUserSpecVisitor {
  emailEqual(s: WithUserEmail): void
  not(): IUserSpecVisitor
}

export type UserSpecification = CompositeSpecification<User, IUserSpecVisitor>

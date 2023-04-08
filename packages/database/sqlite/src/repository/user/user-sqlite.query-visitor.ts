import type { IUserSpecVisitor, WithUserEmail } from '@egodb/core'
import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import { User } from '../../entity/user.js'

export class UserSqliteQueryVisitor implements IUserSpecVisitor {
  constructor(private readonly em: EntityManager, private qb: QueryBuilder<User>) {}

  emailEqual(s: WithUserEmail): void {
    const emailFieldName = this.em.getMetadata().get(User.name).properties.email.fieldNames[0]
    this.qb.where({ [emailFieldName]: s.email })
  }

  not(): IUserSpecVisitor {
    throw new Error('not implemented')
  }
}

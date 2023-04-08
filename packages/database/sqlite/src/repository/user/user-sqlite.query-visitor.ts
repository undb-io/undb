import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import type { IUserSpecVisitor, WithUserEmail, WithUserId, WithUsername } from '@undb/core'
import { User } from '../../entity/user.js'

export class UserSqliteQueryVisitor implements IUserSpecVisitor {
  constructor(private readonly em: EntityManager, private qb: QueryBuilder<User>) {}
  idEqual(s: WithUserId): void {
    const idFieldName = this.em.getMetadata().get(User.name).properties.id.fieldNames[0]
    this.qb.where({ [idFieldName]: s.userId.value })
  }

  usernameEqual(s: WithUsername): void {
    const nameFieldName = this.em.getMetadata().get(User.name).properties.username.fieldNames[0]
    this.qb.where({ [nameFieldName]: s.username })
  }

  emailEqual(s: WithUserEmail): void {
    const emailFieldName = this.em.getMetadata().get(User.name).properties.email.fieldNames[0]
    this.qb.where({ [emailFieldName]: s.email })
  }

  not(): IUserSpecVisitor {
    throw new Error('not implemented')
  }
}

import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import type {
  IUserSpecVisitor,
  WithUserAvatar,
  WithUserColor,
  WithUserEmail,
  WithUserId,
  WithUserIds,
  WithUsername,
} from '@undb/core'
import { User } from '../../entity/user.js'

export class UserSqliteQueryVisitor implements IUserSpecVisitor {
  constructor(private readonly em: EntityManager, private qb: QueryBuilder<User>) {}
  colorEqual(s: WithUserColor): void {
    throw new Error('Method not implemented.')
  }
  idEqual(s: WithUserId): void {
    const idFieldName = this.em.getMetadata().get(User.name).properties.id.fieldNames[0]
    this.qb.where({ [idFieldName]: s.userId.value })
  }
  idsIn(s: WithUserIds): void {
    this.qb.where({ id: { $in: s.userIds.map((u) => u.value) } })
  }

  usernameEqual(s: WithUsername): void {
    const nameFieldName = this.em.getMetadata().get(User.name).properties.username.fieldNames[0]
    this.qb.where({ [nameFieldName]: s.username })
  }

  avatarEqual(s: WithUserAvatar): void {
    throw new Error('Method not implemented.')
  }

  emailEqual(s: WithUserEmail): void {
    const emailFieldName = this.em.getMetadata().get(User.name).properties.email.fieldNames[0]
    this.qb.where({ [emailFieldName]: s.email })
  }

  or(): IUserSpecVisitor {
    throw new Error('not implemented')
  }

  not(): IUserSpecVisitor {
    throw new Error('not implemented')
  }
}

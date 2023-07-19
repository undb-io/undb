import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
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

export class UserSqliteMutationVisitor implements IUserSpecVisitor {
  constructor(private readonly userId: string, private readonly em: EntityManager) {}
  idsIn(s: WithUserIds): void {
    throw new Error('Method not implemented.')
  }
  idEqual(s: WithUserId): void {
    throw new Error('not implemented')
  }

  usernameEqual(s: WithUsername): void {
    const user = this.em.getReference(User, this.userId)
    wrap(user).assign({ username: s.username })
    this.em.persist(user)
  }

  avatarEqual(s: WithUserAvatar): void {
    const user = this.em.getReference(User, this.userId)
    wrap(user).assign({ avatar: s.avatar })
    this.em.persist(user)
  }

  colorEqual(s: WithUserColor): void {
    const user = this.em.getReference(User, this.userId)
    wrap(user).assign({ color: s.color })
    this.em.persist(user)
  }

  emailEqual(s: WithUserEmail): void {
    throw new Error('not implemented')
  }

  or(): IUserSpecVisitor {
    throw new Error('not implemented')
  }

  not(): IUserSpecVisitor {
    throw new Error('not implemented')
  }
}

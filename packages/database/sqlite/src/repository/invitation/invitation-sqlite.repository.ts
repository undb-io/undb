import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IEvent } from '@undb/domain'
import type { IInvitationRepository, Invitation as InvitationDo, InvitationSpecification } from '@undb/integrations'
import { None, Some, type Option } from 'oxide.ts'
import { Invitation } from '../../entity/invitation.js'
import { Outbox } from '../../entity/outbox.js'
import { User } from '../../entity/user.js'
import { InvitationSqliteMapper } from './invitation-sqlite.mapper.js'
import { InvitationSqliteMutationVisitor } from './invitation-sqlite.mutation-visitor.js'
import { InvitationSqliteQueryVisitor } from './invitation-sqlite.query-visitor.js'

export class InvitationSqliteRepository implements IInvitationRepository {
  constructor(protected readonly em: EntityManager) {}
  async findOneById(id: string): Promise<Option<InvitationDo>> {
    const em = this.em.fork()
    const found = await em.findOne(Invitation, id)

    if (!found) {
      return None
    }

    await em.populate(found, ['invitedBy.username'])

    return Some(InvitationSqliteMapper.toDomain(found))
  }

  async findOne(spec: InvitationSpecification): Promise<Option<InvitationDo>> {
    const em = this.em.fork()
    const qb = em.qb(Invitation)

    const visitor = new InvitationSqliteQueryVisitor(em, qb)
    spec.accept(visitor)

    const found = await qb.getSingleResult()
    if (!found) {
      return None
    }

    await em.populate(found, ['invitedBy.username'])

    return Some(InvitationSqliteMapper.toDomain(found))
  }

  async updateOneById(id: string, spec: InvitationSpecification): Promise<void> {
    const em = this.em.fork()

    const visitor = new InvitationSqliteMutationVisitor(id, em)
    spec.accept(visitor)

    await em.flush()
  }

  async insert(invitation: InvitationDo, evt: IEvent): Promise<void> {
    const em = this.em.fork()
    const invitedBy = em.getReference(User, invitation.invitedBy.value)
    const entity = new Invitation(invitation, invitedBy)
    em.persist(entity)

    em.persist(new Outbox(evt))

    await em.flush()
  }
}

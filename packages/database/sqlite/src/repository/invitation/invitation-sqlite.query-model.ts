import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { InvitationSpecification } from '@undb/integrations'
import { type IInvitationQueryModel, type IQueryInvitation } from '@undb/integrations'
import { None, Some, type Option } from 'oxide.ts'
import { Invitation } from '../../entity/invitation.js'
import { InvitationSqliteMapper } from './invitation-sqlite.mapper.js'
import { InvitationSqliteQueryVisitor } from './invitation-sqlite.query-visitor.js'

export class InvitationSqliteQueryModel implements IInvitationQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async findOneById(id: string): Promise<Option<IQueryInvitation>> {
    const found = await this.em.findOne(Invitation, id)
    return found ? Some(InvitationSqliteMapper.toQuery(found)) : None
  }

  async find(spec: Option<InvitationSpecification>): Promise<IQueryInvitation[]> {
    const em = this.em.fork()

    const qb = em.qb(Invitation)
    if (spec.isSome()) {
      const visitor = new InvitationSqliteQueryVisitor(em, qb)
      spec.unwrap().accept(visitor)
    }

    const results = await qb.getResultList()

    await em.populate(results, ['invitedBy.username'])

    return results.map((entity) => InvitationSqliteMapper.toQuery(entity))
  }
}

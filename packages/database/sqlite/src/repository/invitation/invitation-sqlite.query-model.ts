import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { InvitationSpecification } from '@undb/integrations'
import { type IInvitationQueryModel, type IQueryInvitation } from '@undb/integrations'
import type { Option } from 'oxide.ts'
import { Invitation } from '../../entity/invitation.js'
import { InvitationSqliteMapper } from './invitation-sqlite.mapper.js'
import { InvitationSqliteQueryVisitor } from './invitation-sqlite.query-visitor.js'

export class InvitationSqliteQueryModel implements IInvitationQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(spec: Option<InvitationSpecification>): Promise<IQueryInvitation[]> {
    const em = this.em.fork()

    if (spec.isSome()) {
      const visitor = new InvitationSqliteQueryVisitor(em, em.qb(Invitation))
      spec.unwrap().accept(visitor)
    }

    const results = await em.find(Invitation, {})

    return results.map((entity) => InvitationSqliteMapper.toQuery(entity))
  }
}

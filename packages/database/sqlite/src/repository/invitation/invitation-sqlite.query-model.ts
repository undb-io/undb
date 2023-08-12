import type { EntityManager } from '@mikro-orm/better-sqlite'
import { type IInvitationQueryModel, type IQueryInvitation } from '@undb/integrations'
import { Invitation } from '../../entity/invitation.js'
import { InvitationSqliteMapper } from './invitation-sqlite.mapper.js'

export class InvitationSqliteQueryModel implements IInvitationQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(): Promise<IQueryInvitation[]> {
    const em = this.em.fork()

    const results = await em.find(Invitation, {})

    return results.map((entity) => InvitationSqliteMapper.toQuery(entity))
  }
}

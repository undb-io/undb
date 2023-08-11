import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IInvitationRepository, Invitation as InvitationDo } from '@undb/integrations'
import { Invitation } from '../../entity/invitation.js'

export class InvitationSqliteRepository implements IInvitationRepository {
  constructor(protected readonly em: EntityManager) {}

  async insert(invitation: InvitationDo): Promise<void> {
    const entity = new Invitation(invitation)
    await this.em.insert(entity)
  }
}

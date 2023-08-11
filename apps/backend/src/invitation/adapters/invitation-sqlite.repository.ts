import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { Invitation } from '@undb/integrations'
import { EntityManager, InvitationSqliteRepository } from '@undb/sqlite'

export const INVITATION_REPOSITORY = Symbol('INVITATION_REPOSITORY')

export const InjectInvitationRepository = () => Inject(INVITATION_REPOSITORY)

@Injectable()
export class NestInvitationSqliteRepository extends InvitationSqliteRepository {
  constructor(
    protected readonly orm: MikroORM,
    protected readonly em: EntityManager,
  ) {
    super(em)
  }

  @UseRequestContext()
  insert(invitation: Invitation): Promise<void> {
    return super.insert(invitation)
  }
}

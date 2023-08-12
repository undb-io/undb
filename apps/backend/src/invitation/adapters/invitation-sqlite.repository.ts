import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { Invitation, type InvitationSpecification } from '@undb/integrations'
import { EntityManager, InvitationSqliteRepository } from '@undb/sqlite'
import type { Option } from 'oxide.ts'

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

  @UseRequestContext()
  findOne(spec: InvitationSpecification): Promise<Option<Invitation>> {
    return super.findOne(spec)
  }

  @UseRequestContext()
  updateOneById(id: string, spec: InvitationSpecification): Promise<void> {
    return super.updateOneById(id, spec)
  }
}

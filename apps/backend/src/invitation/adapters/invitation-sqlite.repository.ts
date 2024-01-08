import { CreateRequestContext, MikroORM } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { type IEvent } from '@undb/domain'
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

  @CreateRequestContext()
  insert(invitation: Invitation, evt: IEvent): Promise<void> {
    return super.insert(invitation, evt)
  }

  @CreateRequestContext()
  findOneById(id: string): Promise<Option<Invitation>> {
    return super.findOneById(id)
  }

  @CreateRequestContext()
  findOne(spec: InvitationSpecification): Promise<Option<Invitation>> {
    return super.findOne(spec)
  }

  @CreateRequestContext()
  updateOneById(id: string, spec: InvitationSpecification): Promise<void> {
    return super.updateOneById(id, spec)
  }
}

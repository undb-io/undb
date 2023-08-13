import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import type { IQueryInvitation } from '@undb/integrations'
import { type InvitationSpecification } from '@undb/integrations'
import { EntityManager, InvitationSqliteQueryModel } from '@undb/sqlite'
import { Option } from 'oxide.ts'

export const INVITATION_QUERY_MODEL = Symbol('INVITATION_QUERY_MODEL')

export const InjectInvitationQueryModel = () => Inject(INVITATION_QUERY_MODEL)

@Injectable()
export class NestInvitationSqliteQueryModel extends InvitationSqliteQueryModel {
  constructor(
    protected readonly orm: MikroORM,
    protected readonly em: EntityManager,
  ) {
    super(em)
  }

  @UseRequestContext()
  find(spec: Option<InvitationSpecification>) {
    return super.find(spec)
  }

  @UseRequestContext()
  findOneById(id: string): Promise<Option<IQueryInvitation>> {
    return super.findOneById(id)
  }
}

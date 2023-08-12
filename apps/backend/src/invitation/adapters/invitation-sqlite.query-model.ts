import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { EntityManager, InvitationSqliteQueryModel } from '@undb/sqlite'

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
  find() {
    return super.find()
  }
}

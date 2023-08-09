import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import type { IQueryMember } from '@undb/authz'
import { type MemberSpecification } from '@undb/authz'
import { EntityManager, MemberSqliteQueryModel } from '@undb/sqlite'
import { Option } from 'oxide.ts'

export const MEMBER_QUERY_MODEL = Symbol('MEMBER_QUERY_MODEL')

export const InjectMemberQueryModel = () => Inject(MEMBER_QUERY_MODEL)

@Injectable()
export class NestMemberSqliteQueryModel extends MemberSqliteQueryModel {
  constructor(
    protected readonly orm: MikroORM,
    protected readonly em: EntityManager,
  ) {
    super(em)
  }

  @UseRequestContext()
  find(spec: Option<MemberSpecification>): Promise<IQueryMember[]> {
    return super.find(spec)
  }
}

import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { Member } from '@undb/authz'
import { EntityManager, MemberSqliteRepository } from '@undb/sqlite'

export const MEMBER_REPOSITORY = Symbol('MEMBER_REPOSITORY')

export const InjectMemberRespository = () => Inject(MEMBER_REPOSITORY)

@Injectable()
export class NestMemberSqliteRepository extends MemberSqliteRepository {
  constructor(
    protected readonly orm: MikroORM,
    protected readonly em: EntityManager,
  ) {
    super(em)
  }

  @UseRequestContext()
  insert(member: Member): Promise<void> {
    return super.insert(member)
  }
}

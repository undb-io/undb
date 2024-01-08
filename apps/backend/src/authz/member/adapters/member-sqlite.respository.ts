import { CreateRequestContext, MikroORM } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { Member, type MemberSpecification } from '@undb/authz'
import { EntityManager, MemberSqliteRepository } from '@undb/sqlite'
import type { Option } from 'oxide.ts'

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

  @CreateRequestContext()
  insert(member: Member): Promise<void> {
    return super.insert(member)
  }

  @CreateRequestContext()
  findOne(spec: MemberSpecification): Promise<Option<Member>> {
    return super.findOne(spec)
  }

  @CreateRequestContext()
  findOneById(id: string): Promise<Option<Member>> {
    return super.findOneById(id)
  }

  @CreateRequestContext()
  updateOneById(id: string, spec: MemberSpecification): Promise<void> {
    return super.updateOneById(id, spec)
  }

  @CreateRequestContext()
  count(): Promise<number> {
    return super.count()
  }
}

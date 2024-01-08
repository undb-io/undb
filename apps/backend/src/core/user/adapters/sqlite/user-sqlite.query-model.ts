import { CreateRequestContext, MikroORM } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import type { IQueryUser } from '@undb/core'
import { type UserSpecification } from '@undb/core'
import { EntityManager, UserSqliteQueryModel } from '@undb/sqlite'
import { Option } from 'oxide.ts'

@Injectable()
export class NestUserSqliteQueryModel extends UserSqliteQueryModel {
  constructor(
    protected readonly orm: MikroORM,
    public readonly em: EntityManager,
  ) {
    super(em)
  }

  @CreateRequestContext()
  override find(spec: Option<UserSpecification>) {
    return super.find(spec)
  }

  @CreateRequestContext()
  override findOne(spec: UserSpecification) {
    return super.findOne(spec)
  }

  @CreateRequestContext()
  override async findOneById(id: string): Promise<Option<IQueryUser>> {
    return super.findOneById(id)
  }
}

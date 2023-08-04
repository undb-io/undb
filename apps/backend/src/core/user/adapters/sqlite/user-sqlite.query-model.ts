import { MikroORM, UseRequestContext } from '@mikro-orm/core'
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

  @UseRequestContext()
  override find(spec: Option<UserSpecification>) {
    return super.find(spec)
  }

  @UseRequestContext()
  override findOne(spec: UserSpecification) {
    return super.findOne(spec)
  }

  @UseRequestContext()
  override async findOneById(id: string): Promise<Option<IQueryUser>> {
    return super.findOneById(id)
  }
}

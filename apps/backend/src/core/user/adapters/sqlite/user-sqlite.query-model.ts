import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import type { IQueryUser } from '@undb/core'
import { type UserSpecification } from '@undb/core'
import type { EntityManager } from '@undb/sqlite'
import { UserSqliteQueryModel } from '@undb/sqlite'
import type { Option } from 'oxide.ts'

@Injectable()
export class NestUserSqliteQueryModel extends UserSqliteQueryModel {
  constructor(protected readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }

  @UseRequestContext()
  override find() {
    return super.find()
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

import type { IQueryTable } from '@egodb/core'
import { TableSqliteQueryModel } from '@egodb/sqlite'
import { EntityManager } from '@mikro-orm/better-sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestTableSqliteQueryModel extends TableSqliteQueryModel {
  constructor(public readonly orm: MikroORM, protected readonly em: EntityManager) {
    super(em)
  }

  @UseRequestContext()
  async find(): Promise<IQueryTable[]> {
    return super.find()
  }
}

import type { IQueryTable } from '@egodb/core'
import { type ITableSpec } from '@egodb/core'
import type { EntityManager } from '@egodb/sqlite'
import { TableSqliteQueryModel } from '@egodb/sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import type { Option } from 'oxide.ts'

@Injectable()
export class NestTableSqliteQueryModel extends TableSqliteQueryModel {
  constructor(public readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }

  @UseRequestContext()
  async find(): Promise<IQueryTable[]> {
    return super.find()
  }

  @UseRequestContext()
  async findOne(spec: ITableSpec): Promise<Option<IQueryTable>> {
    return super.findOne(spec)
  }

  @UseRequestContext()
  async findOneById(id: string): Promise<Option<IQueryTable>> {
    return super.findOneById(id)
  }
}

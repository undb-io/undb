import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import type { IQueryTable } from '@undb/core'
import { type ITableSpec } from '@undb/core'
import type { EntityManager } from '@undb/sqlite'
import { TableSqliteQueryModel } from '@undb/sqlite'
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

import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import type { EntityManager } from '@undb/sqlite'
import { RecordSqliteAggregateRepository } from '@undb/sqlite'

@Injectable()
export class NestAggregateSqliteQueryModel extends RecordSqliteAggregateRepository {
  constructor(public readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }

  @UseRequestContext()
  async number(tableId: string): Promise<number> {
    return super.number(tableId)
  }
}

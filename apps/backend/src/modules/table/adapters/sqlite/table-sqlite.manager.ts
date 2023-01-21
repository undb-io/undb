import { Table } from '@egodb/core'
import type { EntityManager } from '@egodb/sqlite'
import { UnderlyingTableSqliteManager } from '@egodb/sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'

export const UNDELYING_TABLE_MANAGER = Symbol('UNDELYING_TABLE_MANAGER')
export const InjectUndelyingTableManager = () => Inject(UNDELYING_TABLE_MANAGER)

@Injectable()
export class NestTableSqliteManager extends UnderlyingTableSqliteManager {
  constructor(protected readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }

  @UseRequestContext()
  create(table: Table): Promise<void> {
    return super.create(table)
  }
}

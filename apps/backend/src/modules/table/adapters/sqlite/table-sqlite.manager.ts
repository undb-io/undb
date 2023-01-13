import { Table } from '@egodb/core'
import { EntityManager, UnderlyingTableSqliteManager } from '@egodb/sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'

export const UNDELYING_TABLE_MANAGER = Symbol('UNDELYING_TABLE_MANAGER')
export const InjectUndelyingTableManager = () => Inject(UNDELYING_TABLE_MANAGER)

@Injectable()
export class NestTableSqliteManager extends UnderlyingTableSqliteManager {
  constructor(protected readonly orm: MikroORM, protected readonly em: EntityManager) {
    super(em)
  }

  @UseRequestContext()
  create(table: Table): Promise<void> {
    return super.create(table)
  }
}

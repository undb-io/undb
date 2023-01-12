import { EntityManager, UnderlyingTableSqliteManager } from '@egodb/sqlite'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestTableSqliteManager extends UnderlyingTableSqliteManager {
  constructor(protected readonly em: EntityManager) {
    super(em)
  }
}

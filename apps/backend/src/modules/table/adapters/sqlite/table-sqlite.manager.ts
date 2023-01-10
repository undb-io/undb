import { EntityManager, TableSqliteManager } from '@egodb/sqlite'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestTableSqliteManager extends TableSqliteManager {
  constructor(protected readonly em: EntityManager) {
    super(em)
  }
}

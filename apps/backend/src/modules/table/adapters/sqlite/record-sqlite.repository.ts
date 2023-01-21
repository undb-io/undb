import type { EntityManager } from '@egodb/sqlite'
import { RecordSqliteRepository } from '@egodb/sqlite'
import { MikroORM } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestRecordSqliteRepository extends RecordSqliteRepository {
  constructor(protected readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }
}

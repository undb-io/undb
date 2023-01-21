import type { IRecordQueryModel } from '@egodb/core'
import type { EntityManager } from '@egodb/sqlite'
import { RecordSqliteQueryModel } from '@egodb/sqlite'
import { MikroORM } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestRecordSqliteQueryModel extends RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }
}

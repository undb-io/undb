import type { IRecordQueryModel } from '@egodb/core'
import { EntityManager, RecordSqliteQueryModel } from '@egodb/sqlite'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestRecordSqliteQueryModel extends RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly em: EntityManager) {
    super(em)
  }
}

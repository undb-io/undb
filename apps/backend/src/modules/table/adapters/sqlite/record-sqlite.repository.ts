import { EntityManager, RecordSqliteRepository } from '@egodb/sqlite'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestRecordSqliteRepository extends RecordSqliteRepository {
  constructor(protected readonly em: EntityManager) {
    super(em)
  }
}

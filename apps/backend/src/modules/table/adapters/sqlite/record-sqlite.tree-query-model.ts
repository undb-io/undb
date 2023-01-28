import type { IRecordTreeQueryModel } from '@egodb/core'
import type { EntityManager } from '@egodb/sqlite'
import { RecordSqliteTreeQueryModel } from '@egodb/sqlite'
import { MikroORM } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'

export const RECORD_TREE_QUERY_MODEL = Symbol('RECORD_TREE_QUERY_MODEL')
export const InjectRecordTreeQueryModel = () => Inject(RECORD_TREE_QUERY_MODEL)

@Injectable()
export class NestRecordSqliteTreeQueryModel extends RecordSqliteTreeQueryModel implements IRecordTreeQueryModel {
  constructor(protected readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }
}

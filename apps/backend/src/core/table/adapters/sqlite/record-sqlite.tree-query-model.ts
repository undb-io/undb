import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import type { IQueryTreeRecords, IRecordTreeQueryModel } from '@undb/core'
import { TreeField, type IRecordSpec } from '@undb/core'
import { EntityManager, RecordSqliteTreeQueryModel } from '@undb/sqlite'

export const RECORD_TREE_QUERY_MODEL = Symbol('RECORD_TREE_QUERY_MODEL')
export const InjectRecordTreeQueryModel = () => Inject(RECORD_TREE_QUERY_MODEL)

@Injectable()
export class NestRecordSqliteTreeQueryModel extends RecordSqliteTreeQueryModel implements IRecordTreeQueryModel {
  constructor(protected readonly orm: MikroORM, em: EntityManager) {
    super(em)
  }

  @UseRequestContext()
  async findTrees(tableId: string, field: TreeField, spec: IRecordSpec): Promise<IQueryTreeRecords> {
    return super.findTrees(tableId, field, spec)
  }
}

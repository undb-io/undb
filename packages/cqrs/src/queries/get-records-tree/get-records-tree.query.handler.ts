import { TreeField, withTableRecordsSpec, type IRecordTreeQueryModel, type ITableRepository } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IGetRecordsTreeOutput } from './get-records-tree.query.interface.js'
import type { GetRecordsTreeQuery } from './get-records-tree.query.js'

export class GetRecordsTreeQueryHandler implements IQueryHandler<GetRecordsTreeQuery, IGetRecordsTreeOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordTreeQueryModel) {}

  async execute(query: GetRecordsTreeQuery): Promise<IGetRecordsTreeOutput> {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const field = table.schema.getFieldByIdOfType(query.fieldId, TreeField).unwrap()

    const spec = withTableRecordsSpec(table, query.viewId)
    const records = await this.rm.findTrees(table.id.value, field, spec)

    return { records }
  }
}

import type { IQueryHandler } from '@egodb/domain'
import { TreeField } from '../../field'
import { WithRecordTableId } from '../../record'
import type { IRecordTreeQueryModel } from '../../record/record-tree-query-model'
import type { ITableRepository } from '../../table.repository'
import type { GetRecordsTreeQuery } from './get-records-tree.query'
import type { IGetRecordsTreeOutput } from './get-records-tree.query.interface'

export class GetRecordsTreeQueryHandler implements IQueryHandler<GetRecordsTreeQuery, IGetRecordsTreeOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordTreeQueryModel) {}

  async execute(query: GetRecordsTreeQuery): Promise<IGetRecordsTreeOutput> {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const field = table.schema.getFieldByIdOfType(query.fieldId, TreeField).unwrap()
    const filter = table.getSpec(query.viewKey)

    const spec = WithRecordTableId.fromString(query.tableId)
      .map((s) => (filter.isNone() ? s : s.and(filter.unwrap())))
      .unwrap()

    const records = await this.rm.findTrees(table.id.value, field, spec, table.schema.toIdMap())

    return { records }
  }
}

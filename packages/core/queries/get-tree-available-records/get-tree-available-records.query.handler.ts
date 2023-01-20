import type { IQueryHandler } from '@egodb/domain'
import { andOptions } from '@egodb/domain'
import { Option } from 'oxide.ts'
import type { IRecordQueryModel } from '../../record'
import { TreeAvailableSpec, WithRecordTableId } from '../../record'
import type { ITableRepository } from '../../table.repository'
import type { GetTreeAvailableRecordsQuery } from './get-tree-available-records.query'
import type { IGetTreeAvailableRecordsOutput } from './get-tree-available-records.query.interface'

export class GetTreeAvailableRecordsQueryHandler
  implements IQueryHandler<GetTreeAvailableRecordsQuery, IGetTreeAvailableRecordsOutput>
{
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetTreeAvailableRecordsQuery): Promise<IGetTreeAvailableRecordsOutput> {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const spec = andOptions(
      table.getSpec(query.viewId),
      Option(WithRecordTableId.fromString(query.tableId).unwrap()),
      Option(new TreeAvailableSpec(query.treeFieldId, undefined)),
    ).unwrap()

    const records = await this.rm.find(query.tableId, spec, table.schema.toIdMap())

    return { records }
  }
}

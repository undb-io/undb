import { IRecordQueryModel, ITableRepository } from '@egodb/core'
import type { IQueryHandler } from '@egodb/domain'
import type { IGetRecordOutput } from './get-record.query.interface.js'
import type { GetRecordQuery } from './get-record.query.js'

export class GetRecordQueryHandler implements IQueryHandler<GetRecordQuery, IGetRecordOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetRecordQuery): Promise<IGetRecordOutput> {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()

    const record = (await this.rm.findOneById(table.id.value, query.id, table.schema.toIdMap())).into()

    return record
  }
}

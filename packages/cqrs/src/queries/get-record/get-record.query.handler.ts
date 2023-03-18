import { type IRecordQueryModel, type ITableRepository } from '@egodb/core'
import type { IQueryHandler } from '@egodb/domain'
import type { IGetRecordOutput } from './get-record.query.interface.js'
import type { GetRecordQuery } from './get-record.query.js'

export class GetRecordQueryHandler implements IQueryHandler<GetRecordQuery, IGetRecordOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetRecordQuery): Promise<IGetRecordOutput> {
    const record = (await this.rm.findOneById(query.tableId, query.id)).into()

    return record
  }
}

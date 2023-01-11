import type { IQueryHandler } from '@egodb/domain'
import type { IRecordQueryModel } from '../../record'
import type { ITableRepository } from '../../table.repository'
import type { GetRecordQuery } from './get-record.query'
import type { IGetRecordOutput } from './get-record.query.interface'

export class GetRecordQueryHandler implements IQueryHandler<GetRecordQuery, IGetRecordOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetRecordQuery): Promise<IGetRecordOutput> {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()

    const record = (await this.rm.findOneById(query.id, table.schema.toMap())).into()

    return record
  }
}

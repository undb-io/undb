import type { IQueryHandler } from '@egodb/domain'
import type { IRecordQueryModel } from '../../record'
import { WithRecordId } from '../../record'
import type { ITableRepository } from '../../table.repository'
import type { GetRecordQuery } from './get-record.query'
import type { IGetRecordOutput } from './get-record.query.interface'

export class GetRecordQueryHandler implements IQueryHandler<GetRecordQuery, IGetRecordOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetRecordQuery): Promise<IGetRecordOutput> {
    const spec = WithRecordId.fromString(query.id)

    const record = (await this.rm.findOne(spec)).unwrap()

    return record
  }
}

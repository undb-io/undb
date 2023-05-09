import type { IRecordAggregateRepository, ITableRepository } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IAggregateNumberOutput } from './aggregate-number.query.interface.js'
import type { AggregateNumberQuery } from './aggregate-number.query.js'

export class AggregateNumberQueryHandler implements IQueryHandler<AggregateNumberQuery, IAggregateNumberOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly repo: IRecordAggregateRepository) {}

  async execute(query: AggregateNumberQuery): Promise<IAggregateNumberOutput> {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const spec = table.getSpec(query.viewId).into(null)

    const number = await this.repo.number(query.tableId, spec)

    return {
      number,
    }
  }
}

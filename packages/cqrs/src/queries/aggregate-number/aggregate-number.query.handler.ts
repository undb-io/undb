import type { IRecordAggregateRepository, ITableRepository } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IAggregateNumberOutput } from './aggregate-number.query.interface.js'
import type { AggregateNumberQuery } from './aggregate-number.query.js'

export class AggregateNumberQueryHandler implements IQueryHandler<AggregateNumberQuery, IAggregateNumberOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly repo: IRecordAggregateRepository) {}

  async execute(query: AggregateNumberQuery): Promise<IAggregateNumberOutput> {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const view = table.mustGetView(query.viewId)
    const visualization = view.mustGetVisualization(query.visualizationId)

    const number = await this.repo.number(query.tableId, visualization, null)

    return {
      number,
    }
  }
}

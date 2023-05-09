import { type ITableQueryModel } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IAggregateNumberOutput } from './aggregate-number.query.interface.js'
import type { AggregateNumberQuery } from './aggregate-number.query.js'

export class AggregateNumberQueryHandler implements IQueryHandler<AggregateNumberQuery, IAggregateNumberOutput> {
  constructor(protected readonly rm: ITableQueryModel) {}

  async execute(query: AggregateNumberQuery): Promise<IAggregateNumberOutput> {
    return {
      number: 671,
    }
  }
}

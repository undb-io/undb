import type { Query } from './query.js'

export interface IQueryBus<TQuery extends Query = Query> {
  execute<TResult>(command: TQuery): Promise<TResult>
}

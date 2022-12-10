import type { Query } from './query'

export interface IQueryBus<TQuery extends Query = Query> {
  execute<TResult>(command: TQuery): Promise<TResult>
}

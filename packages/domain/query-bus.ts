import type { Query } from './query'

export interface IQueryBus<TQuery extends Query = Query, TResult = any> {
  execute(command: TQuery): Promise<TResult>
}

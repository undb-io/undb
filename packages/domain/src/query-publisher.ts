import type { Query } from "./query"

export interface IQueryPublisher<C extends Query = Query> {
  publish<T extends C = C>(command: T): any
}

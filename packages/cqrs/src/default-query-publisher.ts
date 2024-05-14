import type { IQueryPublisher, Query } from "@undb/domain"
import { Subject } from "rxjs"

export class DefaultQueryPubSub<Q extends Query> implements IQueryPublisher<Q> {
  constructor(public subject$: Subject<Q>) {}

  publish<T extends Q>(query: T) {
    this.subject$.next(query)
  }
}

import type { AggregateRoot } from "./aggregate-root"

export interface IOutboxService<DO extends AggregateRoot<any>> {
  save(d: DO): Promise<void>
}

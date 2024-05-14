import type { Command, ICommandPublisher } from "@undb/domain"
import { Subject } from "rxjs"

export class DefaultCommandPubSub<C extends Command> implements ICommandPublisher<C> {
  constructor(public subject$: Subject<C>) {}

  publish<T extends C>(command: T) {
    this.subject$.next(command)
  }
}

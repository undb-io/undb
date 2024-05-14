import type { BaseEvent } from "./event"

export abstract class AggregateRoot {
  #domainEvents: BaseEvent[] = []

  get domainEvents() {
    return this.#domainEvents
  }

  protected addDomainEvent(event: BaseEvent) {
    this.#domainEvents.push(event)
  }
}

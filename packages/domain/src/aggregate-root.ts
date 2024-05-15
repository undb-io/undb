import type { BaseEvent } from "./event"

export abstract class AggregateRoot<E extends BaseEvent> {
  #domainEvents: E[] = []

  get domainEvents() {
    return this.#domainEvents
  }

  protected addDomainEvent(event: E) {
    this.#domainEvents.push(event)
  }

  removeEvents(events: E[]) {
    this.#domainEvents = this.#domainEvents.filter((event) => !events.includes(event))
  }
}

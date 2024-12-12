import { container, singleton, type DependencyContainer } from "@undb/di"
import type { BaseEvent, EventMetadata, IEventBus, IEventHandler, IEventPublisher } from "@undb/domain"
import { Subject } from "rxjs"
import type { Class } from "type-fest"
import { EVENT_HANDLER_METADATA, EVENT_METADATA } from "./decorators/constants"
import { DefaultEventPubSub } from "./default-event-publisher"
import { InvalidEventHandlerException } from "./exceptions/invalid-event-handler.exception"

export type EventHandlerType = Class<IEventHandler<BaseEvent, any>>

@singleton()
export class EventBus<TEvent extends BaseEvent = BaseEvent> implements IEventBus<TEvent> {
  private subject = new Subject<TEvent>()
  private readonly publisher: IEventPublisher = new DefaultEventPubSub(this.subject)

  #handlers = new Map<string, IEventHandler<TEvent, any>>()

  async publish(event: TEvent): Promise<void> {
    const eventId = this.getEventId(event)
    if (!eventId) {
      return
    }

    const handler = this.#handlers.get(eventId)
    if (!handler) {
      return
    }
    this.publisher.publish(event)
    return handler.handle(event)
  }

  async publishMany(events: TEvent[]): Promise<void> {
    await Promise.all(events.map((event) => this.publish(event)))
  }

  register(handlers: EventHandlerType[] = [], c = container) {
    handlers.forEach((handler) => this.registerHandler(c, handler))
  }

  private bind<T extends TEvent>(handler: IEventHandler<T, any>, id: string) {
    this.#handlers.set(id, handler)
  }

  protected registerHandler(container: DependencyContainer, handler: EventHandlerType) {
    const instance = container.resolve(handler)
    if (!instance) {
      return
    }
    const target = this.reflectEventId(handler)
    if (!target) {
      throw new InvalidEventHandlerException()
    }
    this.bind(instance as IEventHandler<TEvent, any>, target)
  }

  private reflectEventId(handler: EventHandlerType): string | undefined {
    const event: BaseEvent = Reflect.getMetadata(EVENT_HANDLER_METADATA, handler)
    const eventMetadata: EventMetadata = Reflect.getMetadata(EVENT_METADATA, event)
    return eventMetadata.id
  }

  private getEventId(event: TEvent): string | undefined {
    const { constructor: eventType } = Object.getPrototypeOf(event)
    const eventMetadata: EventMetadata = Reflect.getMetadata(EVENT_METADATA, eventType)
    if (!eventMetadata) {
      return
    }
    return eventMetadata.id
  }

  private getEventName(event: TEvent): string {
    const { constructor } = Object.getPrototypeOf(event)
    return constructor.name as string
  }
}

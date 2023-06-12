import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IEvent } from '@undb/domain'
import { Outbox } from '../entity/outbox.js'

export interface IOutboxService {
  create(event: IEvent): void
}

export class OutboxService implements IOutboxService {
  constructor(protected readonly em: EntityManager) {}

  create(event: IEvent): void {
    const outbox = new Outbox(event)
    this.em.persist(outbox)
  }
}

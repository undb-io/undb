import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IEvent } from '@undb/domain'
import { Outbox } from '../entity/outbox.js'

export interface IOutboxService {
  create(event: IEvent): void
  handle(cb: (outboxList: Outbox[]) => Promise<void> | void): Promise<void>
}

export class OutboxService implements IOutboxService {
  constructor(protected readonly em: EntityManager) {}

  create(event: IEvent): void {
    const outbox = new Outbox(event)
    this.em.persist(outbox)
  }

  async handle(cb: (outboxList: Outbox[]) => void | Promise<void>): Promise<void> {
    await this.em.transactional(async (em) => {
      const outboxList = await em.find(Outbox, {}, { limit: 10, orderBy: { createdAt: 'desc' } })

      if (!outboxList.length) return

      const ids = outboxList.map((o) => o.uuid)
      await cb(outboxList)

      await em.nativeDelete(Outbox, { uuid: { $in: ids } })
    })
  }
}

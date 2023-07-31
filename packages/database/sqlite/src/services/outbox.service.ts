import type { EntityManager } from '@mikro-orm/better-sqlite'
import { LockMode } from '@mikro-orm/core'
import type { IEvent, IUnitOfWork } from '@undb/domain'
import { Outbox } from '../entity/outbox.js'

export interface IOutboxService {
  persist(event: IEvent): Outbox
  handle(cb: (outboxList: Outbox[]) => Promise<void> | void): Promise<void>
}

export class OutboxService implements IOutboxService {
  constructor(
    protected readonly uow: IUnitOfWork<EntityManager>,
    private readonly count: number,
  ) {}

  private get em() {
    return this.uow.conn()
  }

  persist(event: IEvent): Outbox {
    const outbox = new Outbox(event)
    this.em.persist(outbox)
    return outbox
  }

  async handle(cb: (outboxList: Outbox[]) => void | Promise<void>): Promise<void> {
    await this.em.transactional(async (em) => {
      const outboxList = await em.find(
        Outbox,
        {},
        { limit: this.count, orderBy: { createdAt: 'desc' }, lockMode: LockMode.PESSIMISTIC_WRITE },
      )

      if (!outboxList.length) return

      const ids = outboxList.map((o) => o.uuid)
      await cb(outboxList)

      await em.nativeDelete(Outbox, { uuid: { $in: ids } })
    })
  }
}

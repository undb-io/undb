import { Injectable } from '@nestjs/common'
import { EventFactory as CoreEventFactory } from '@undb/core'
import type { IEvent } from '@undb/domain'
import { EventFactory as InvitationEventFactory } from '@undb/integrations'
import type { Outbox } from '@undb/sqlite'

@Injectable()
export class ReplyEventService {
  construcEvent(outbox: Outbox) {
    let event: IEvent | null = CoreEventFactory.create(
      outbox.uuid,
      outbox.operatorId,
      outbox.name,
      outbox.payload,
      outbox.meta,
      outbox.timestamp,
    )

    if (!event) {
      event = InvitationEventFactory.create(
        outbox.uuid,
        outbox.operatorId,
        outbox.name,
        outbox.payload,
        outbox.meta,
        outbox.timestamp,
      )
    }

    return event ?? null
  }
}

import { eventHandler } from "@undb/cqrs"
import type { IEventHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { FieldDeletedEvent } from "../../../table/src"

@eventHandler(FieldDeletedEvent)
export class DashboardOnFieldDeletedEventHandle implements IEventHandler<FieldDeletedEvent> {
  private readonly logger = createLogger(DashboardOnFieldDeletedEventHandle.name)

  handle(event: FieldDeletedEvent): void | Promise<void> {
    this.logger.debug(event)
  }
}

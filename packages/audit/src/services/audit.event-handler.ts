import { inject, singleton } from "@undb/di"
import type { IEventHandler } from "@undb/domain"
import type { IRecordEvent } from "@undb/table"
import { map } from "radash"
import { AuditFactory } from "../audit.factory"
import { AuditService } from "./audit.service"
import { createLogger } from "@undb/logger"

@singleton()
export class AuditEventHandler implements IEventHandler<IRecordEvent> {
  private logger = createLogger(AuditEventHandler.name)
  constructor(
    @inject(AuditService)
    private readonly service: AuditService,
  ) {}

  async handle(event: IRecordEvent) {
    this.logger.debug("Handling audit event", event)

    const audits = AuditFactory.fromRecordEvent(event)
    await map(audits, (audit) => {
      return this.service.saveAudit(audit)
    })
  }
}

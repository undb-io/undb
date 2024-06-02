import { inject, singleton } from "@undb/di"
import type { IEventHandler } from "@undb/domain"
import type { IRecordEvent } from "@undb/table"
import { map } from "radash"
import { AuditFactory } from "../audit.factory"
import { AuditService } from "./audit.service"

@singleton()
export class AuditEventHandler implements IEventHandler<IRecordEvent> {
  constructor(
    @inject(AuditService)
    private readonly service: AuditService,
  ) {}

  async handle(event: IRecordEvent) {
    const audits = AuditFactory.fromRecordEvent(event)
    await map(audits, (audit) => {
      return this.service.saveAudit(audit)
    })
  }
}

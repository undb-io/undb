import { singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import { injectMailService, type IMailService } from "@undb/mail"
import type { InvitationDo } from "./invitation.do"

export interface IInvitationMailService {
  send(invitation: InvitationDo): Promise<void>
}

@singleton()
export class InvitationMailService implements IInvitationMailService {
  logger = createLogger(InvitationMailService.name)
  constructor(
    @injectMailService()
    private readonly svc: IMailService,
  ) {}

  async send(invitation: InvitationDo): Promise<void> {
    this.logger.info(invitation, "sending invitation mail...")

    await this.svc.send()
  }
}

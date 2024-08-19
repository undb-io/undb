import { singleton } from "@undb/di"
import { env } from "@undb/env"
import { createLogger } from "@undb/logger"
import { injectMailService, type IMailService } from "@undb/mail"
import { injectSpaceService, type ISpaceService } from "@undb/space"
import type { InvitationDTO } from "./dto"

export interface IInvitationMailService {
  invite(invitation: InvitationDTO, username: string): Promise<void>
}

@singleton()
export class InvitationMailService implements IInvitationMailService {
  logger = createLogger(InvitationMailService.name)
  constructor(
    @injectMailService()
    private readonly svc: IMailService,
    @injectSpaceService()
    private readonly spaceService: ISpaceService,
  ) {}

  async invite(invitation: InvitationDTO, username: string): Promise<void> {
    this.logger.info(invitation, "sending invitation mail...")

    const space = (await this.spaceService.getSpace({ spaceId: invitation.spaceId })).expect("space not found")

    await this.svc.send({
      template: "invite",
      to: invitation.email,
      subject: `You have been invited to join the space ${space.name.value}`,
      data: {
        invite_sender_name: username,
        space_name: space.name.value,
        email: invitation.email,
        action_url: new URL(`/invitation/${invitation.id}/accept`, env.UNDB_BASE_URL).toString(),
        help_url: "https://undb.io",
      },
    })
  }
}

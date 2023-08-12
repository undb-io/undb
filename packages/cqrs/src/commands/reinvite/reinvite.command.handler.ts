import type { ClsStore, IClsService } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { IInvitationRepository } from '@undb/integrations'
import type { ReInviteCommand } from './reinvite.command.js'

type IReInviteCommandHandler = ICommandHandler<ReInviteCommand, void>

export class ReInviteCommandHandler implements IReInviteCommandHandler {
  constructor(
    protected readonly repo: IInvitationRepository,
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  async execute(command: ReInviteCommand): Promise<void> {
    const userId = this.cls.get('user.userId')

    const invitation = (await this.repo.findOneById(command.id)).unwrap()
    const spec = invitation.reinvite(command.role, userId)

    await this.repo.updateOneById(invitation.id.value, spec)
  }
}

import type { ClsStore, IClsService } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { IInvitationRepository } from '@undb/integrations'
import type { CancelInvitationCommand } from './cancel-invitation.command.js'

type ICancelInvitationCommandHandler = ICommandHandler<CancelInvitationCommand, void>

export class CancelInvitationCommandHandler implements ICancelInvitationCommandHandler {
  constructor(
    protected readonly repo: IInvitationRepository,
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  async execute(command: CancelInvitationCommand): Promise<void> {
    const userId = this.cls.get('user.userId')
    const invitation = (await this.repo.findOneById(command.id)).unwrap()

    const spec = invitation.cancel(userId)
    if (spec.isSome()) {
      await this.repo.updateOneById(invitation.id.value, spec.unwrap())
    }
  }
}

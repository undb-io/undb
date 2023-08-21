import { WithUserEmail, type ClsStore, type IClsService, type IUserRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { IInvitationRepository } from '@undb/integrations'
import { InvitationFactory, InvitedEvent, UserAlreadyExists, WithInvitationEmail } from '@undb/integrations'
import type { InviteCommand } from './invite.command.js'

type IInviteCommandHandler = ICommandHandler<InviteCommand, void>

export class InviteCommandHandler implements IInviteCommandHandler {
  constructor(
    protected readonly repo: IInvitationRepository,
    protected readonly userRepo: IUserRepository,
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  async execute(command: InviteCommand): Promise<void> {
    const existUser = (await this.userRepo.findOne(WithUserEmail.fromString(command.email))).into()
    if (existUser) {
      throw new UserAlreadyExists(command.email)
    }

    const userId = this.cls.get('user.userId')
    const user = (await this.userRepo.findOneById(userId)).unwrap()

    const existing = await this.repo.findOne(WithInvitationEmail.fromString(command.email))
    if (existing.isSome()) {
      const spec = existing.unwrap().reinvite(command.role, userId)

      await this.repo.updateOneById(existing.unwrap().id.value, spec)
    } else {
      const invitation = InvitationFactory.invite(command.email, command.role, user)

      const evt = InvitedEvent.from(invitation, userId)

      await this.repo.insert(invitation, evt)
    }
  }
}

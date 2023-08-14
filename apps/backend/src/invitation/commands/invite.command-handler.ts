import { CommandHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { InviteCommand, InviteCommandHandler } from '@undb/cqrs'
import { type IInvitationRepository } from '@undb/integrations'
import { ClsService } from 'nestjs-cls'
import { InjectInvitationRepository } from '../adapters/invitation-sqlite.repository.js'

@CommandHandler(InviteCommand)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestInviteCommandHandler extends InviteCommandHandler {
  constructor(
    @InjectInvitationRepository()
    protected readonly repo: IInvitationRepository,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(repo, cls as IClsService<ClsStore>)
  }
}

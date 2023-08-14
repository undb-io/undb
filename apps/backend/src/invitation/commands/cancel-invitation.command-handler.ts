import { CommandHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { CancelInvitationCommand, CancelInvitationCommandHandler } from '@undb/cqrs'
import { type IInvitationRepository } from '@undb/integrations'
import { ClsService } from 'nestjs-cls'
import { InjectInvitationRepository } from '../adapters/invitation-sqlite.repository.js'

@CommandHandler(CancelInvitationCommand)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestCancelInvitationCommandHandler extends CancelInvitationCommandHandler {
  constructor(
    @InjectInvitationRepository()
    protected readonly repo: IInvitationRepository,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(repo, cls as IClsService<ClsStore>)
  }
}

import { CommandHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { type IUserRepository } from '@undb/core'
import { InviteCommand, InviteCommandHandler } from '@undb/cqrs'
import { type IInvitationRepository } from '@undb/integrations'
import { ClsService } from 'nestjs-cls'
import { InjectUserRepository } from '../../core/user/adapters/index.js'
import { InjectInvitationRepository } from '../adapters/invitation-sqlite.repository.js'

@CommandHandler(InviteCommand)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestInviteCommandHandler extends InviteCommandHandler {
  constructor(
    @InjectInvitationRepository()
    protected readonly repo: IInvitationRepository,
    @InjectUserRepository()
    protected readonly userRepo: IUserRepository,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(repo, userRepo, cls as IClsService<ClsStore>)
  }
}

import { CommandHandler } from '@nestjs/cqrs'
import { type IUserRepository } from '@undb/core'
import { RegisterCommand, RegisterCommandHandler } from '@undb/cqrs'
import { NestMemberCreateService } from '../../authz/member/member-create.service.js'
import { InjectUserRepository } from '../../core/user/adapters/index.js'

@CommandHandler(RegisterCommand)
export class NestRegisterCommandHandler extends RegisterCommandHandler {
  constructor(
    @InjectUserRepository()
    protected readonly repo: IUserRepository,
    protected readonly memberService: NestMemberCreateService,
  ) {
    super(repo, memberService)
  }
}

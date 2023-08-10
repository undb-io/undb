import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IMemberRepository } from '@undb/authz'
import { UpdateRoleCommandHandler as DomainHandler, UpdateRoleCommand } from '@undb/cqrs'
import { InjectMemberRespository } from '../adapters/member-sqlite.respository.js'

@CommandHandler(UpdateRoleCommand)
export class NestUpdateRoleCommandHandler extends DomainHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    @InjectMemberRespository()
    protected readonly repo: IMemberRepository,
  ) {
    super(repo)
  }
}

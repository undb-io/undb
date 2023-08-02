import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRLSRepository } from '@undb/authz'
import { UpdateRLSCommandHandler as DomainHandler, UpdateRLSCommand } from '@undb/cqrs'
import { InjectRLSRepository } from '../adapters/rls-sqlite.repository.js'

@CommandHandler(UpdateRLSCommand)
export class UpdateRLSCommandHandler extends DomainHandler implements ICommandHandler<UpdateRLSCommand, void> {
  constructor(
    @InjectRLSRepository()
    protected readonly repo: IRLSRepository,
  ) {
    super(repo)
  }
}

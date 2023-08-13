import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRLSRepository } from '@undb/authz'
import { DeleteRLSCommand, DeleteRLSCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectRLSRepository } from '../adapters/rls-sqlite.repository.js'

@CommandHandler(DeleteRLSCommand)
export class DeleteRLSCommandHandler extends DomainHandler implements ICommandHandler<DeleteRLSCommand, void> {
  constructor(
    @InjectRLSRepository()
    protected readonly repo: IRLSRepository,
  ) {
    super(repo)
  }
}

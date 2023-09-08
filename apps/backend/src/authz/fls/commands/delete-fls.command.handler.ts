import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IFLSRepository } from '@undb/authz'
import { DeleteFLSCommand, DeleteFLSCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectFLSRepository } from '../adapters/fls-sqlite.repository.js'

@CommandHandler(DeleteFLSCommand)
export class DeleteFLSCommandHandler extends DomainHandler implements ICommandHandler<DeleteFLSCommand, void> {
  constructor(
    @InjectFLSRepository()
    protected readonly repo: IFLSRepository,
  ) {
    super(repo)
  }
}

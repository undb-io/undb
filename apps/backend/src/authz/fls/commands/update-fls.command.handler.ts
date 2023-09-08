import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IFLSRepository } from '@undb/authz'
import { UpdateFLSCommandHandler as DomainHandler, UpdateFLSCommand } from '@undb/cqrs'
import { InjectFLSRepository } from '../adapters/fls-sqlite.repository.js'

@CommandHandler(UpdateFLSCommand)
export class UpdateFLSCommandHandler extends DomainHandler implements ICommandHandler<UpdateFLSCommand, void> {
  constructor(
    @InjectFLSRepository()
    protected readonly repo: IFLSRepository,
  ) {
    super(repo)
  }
}

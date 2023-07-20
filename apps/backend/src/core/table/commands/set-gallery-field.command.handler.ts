import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SetGalleryFieldCommandHandler as DomainHandler, SetGalleryFieldCommand } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(SetGalleryFieldCommand)
export class SetGalleryFieldCommandHandler extends DomainHandler implements ICommandHandler<SetGalleryFieldCommand> {
  constructor(
    @InjectTableRepository()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}

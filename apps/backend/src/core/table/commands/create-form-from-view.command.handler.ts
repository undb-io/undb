import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { CreateFormFromViewCommand, CreateFormFromViewCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(CreateFormFromViewCommand)
export class CreateFormFromViewCommandHandler
  extends DomainHandler
  implements ICommandHandler<CreateFormFromViewCommand, void>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}

import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { CreateShareCommand, CreateShareCommandHandler as DomainHandler } from '@undb/cqrs'
import { type IShareRepository } from '@undb/integrations'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { InjectShareRepository } from '../adapters/share-sqlite.repository.js'

@CommandHandler(CreateShareCommand)
export class NestCreateShareCommandHandler extends DomainHandler implements ICommandHandler<CreateShareCommand, void> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectShareRepository()
    protected readonly webhookRepo: IShareRepository,
  ) {
    super(tableRepo, webhookRepo)
  }
}

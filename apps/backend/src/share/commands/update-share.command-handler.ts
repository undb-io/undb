import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { UpdateShareCommandHandler as DomainHandler, UpdateShareCommand } from '@undb/cqrs'
import { type IShareRepository } from '@undb/integrations'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { InjectShareRepository } from '../adapters/share-sqlite.repository.js'

@CommandHandler(UpdateShareCommand)
export class NestUpdateShareCommandHandler extends DomainHandler implements ICommandHandler<UpdateShareCommand, void> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectShareRepository()
    protected readonly webhookRepo: IShareRepository,
  ) {
    super(tableRepo, webhookRepo)
  }
}

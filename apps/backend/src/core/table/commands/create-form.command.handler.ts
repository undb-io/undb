import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { CreateFormCommand, CreateFormCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectTableRepository } from '../adapters/index.js'

@CommandHandler(CreateFormCommand)
export class CreateFormCommandHandler extends DomainHandler implements ICommandHandler<CreateFormCommand, void> {
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}

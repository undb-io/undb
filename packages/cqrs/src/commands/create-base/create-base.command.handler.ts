import { BaseFactory, type BaseRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { CreateBaseCommand } from './create-base.command.js'

type ICreateBaseCommandHandler = ICommandHandler<CreateBaseCommand, void>

export class CreateBaseCommandHandler implements ICreateBaseCommandHandler {
  constructor(protected readonly repo: BaseRepository) {}

  async execute(command: CreateBaseCommand): Promise<void> {
    const base = BaseFactory.new(command)

    await this.repo.insert(base)
  }
}

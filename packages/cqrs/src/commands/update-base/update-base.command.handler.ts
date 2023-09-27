import { type BaseRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { UpdateBaseCommand } from './update-base.command.js'

type IUpdateBaseCommandHandler = ICommandHandler<UpdateBaseCommand, void>

export class UpdateBaseCommandHandler implements IUpdateBaseCommandHandler {
  constructor(protected readonly repo: BaseRepository) {}

  async execute(command: UpdateBaseCommand): Promise<void> {
    const base = (await this.repo.findOneById(command.id)).unwrap()

    const spec = base.update(command)

    if (spec.isSome()) {
      await this.repo.updateOneById(base.id.value, spec.unwrap())
    }
  }
}

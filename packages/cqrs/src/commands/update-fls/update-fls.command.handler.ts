import { type IFLSRepository } from '@undb/authz'
import type { ICommandHandler } from '@undb/domain'
import type { UpdateFLSCommand } from './update-fls.command.js'

type IUpdateFLSCommandHandler = ICommandHandler<UpdateFLSCommand, void>

export class UpdateFLSCommandHandler implements IUpdateFLSCommandHandler {
  constructor(protected readonly repo: IFLSRepository) {}

  async execute(command: UpdateFLSCommand): Promise<void> {
    const fls = (await this.repo.findOneById(command.id)).unwrap()
    const spec = fls.update(command)
    if (spec.isSome()) {
      await this.repo.updateOneById(command.id, spec.unwrap())
    }
  }
}

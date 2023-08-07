import { type IRLSRepository } from '@undb/authz'
import type { ICommandHandler } from '@undb/domain'
import type { UpdateRLSCommand } from './update-rls.command.js'

type IUpdateRLSCommandHandler = ICommandHandler<UpdateRLSCommand, void>

export class UpdateRLSCommandHandler implements IUpdateRLSCommandHandler {
  constructor(protected readonly repo: IRLSRepository) {}

  async execute(command: UpdateRLSCommand): Promise<void> {
    const rls = (await this.repo.findOneById(command.id)).unwrap()
    const spec = rls.update(command)
    if (spec.isSome()) {
      await this.repo.updateOneById(command.id, spec.unwrap())
    }
  }
}

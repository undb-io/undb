import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { type IShareRepository } from '@undb/integrations'
import type { UpdateShareCommand } from './update-share.command.js'

type IUpdateShareCommandHandler = ICommandHandler<UpdateShareCommand, void>

export class UpdateShareCommandHandler implements IUpdateShareCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly shareRepo: IShareRepository) {}

  async execute(command: UpdateShareCommand): Promise<void> {
    const share = (await this.shareRepo.findOneById(command.shareId)).unwrap()

    const spec = share.update(command.update)
    if (spec.isSome()) {
      await this.shareRepo.updateOneById(share.id.value, spec.unwrap())
    }
  }
}

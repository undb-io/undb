import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { IShareType } from '@undb/integrations'
import { ShareFactory, type IShareRepository } from '@undb/integrations'
import type { CreateShareCommand } from './create-share.command.js'

type ICreateShareCommandHandler = ICommandHandler<CreateShareCommand, void>

export class CreateShareCommandHandler implements ICreateShareCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly shareRepo: IShareRepository) {}

  async execute(command: CreateShareCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const share = ShareFactory.from({
      enabled: command.enabled,
      target: { id: command.targetId, type: command.targetType as IShareType },
    })
    await this.shareRepo.insert(share)
  }
}

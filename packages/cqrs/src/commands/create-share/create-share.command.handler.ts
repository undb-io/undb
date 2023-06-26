import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { ShareFactory, type IShareRepository } from '@undb/integrations'
import type { CreateShareCommand } from './create-share.command.js'

type ICreateShareCommandHandler = ICommandHandler<CreateShareCommand, void>

export class CreateShareCommandHandler implements ICreateShareCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly shareRepo: IShareRepository) {}

  async execute(command: CreateShareCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const view = table.mustGetView(command.targetId)

    const share = ShareFactory.from({ target: { id: view.id.value, type: command.targetType as 'view' } })
    await this.shareRepo.insert(share)
  }
}

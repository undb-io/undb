import { FLSFactory, type IFLSRepository } from '@undb/authz'
import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { CreateFLSCommand } from './create-fls.command.js'

type ICreateFLSCommandHandler = ICommandHandler<CreateFLSCommand, void>

export class CreateFLSCommandHandler implements ICreateFLSCommandHandler {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly repo: IFLSRepository,
  ) {}

  async execute(command: CreateFLSCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const fls = FLSFactory.from(table, command.policy)

    await this.repo.insert(fls)
  }
}

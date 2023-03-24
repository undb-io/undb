import { ForeignTableDomainService, type ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@egodb/domain'
import type { CreateFieldCommand } from './create-field.command.js'

type ICreateFieldCommandHandler = ICommandHandler<CreateFieldCommand, void>

export class CreateFieldCommandHandler implements ICreateFieldCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: CreateFieldCommand): Promise<void> {
    try {
      await this.tableRepo.begin()

      const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
      const spec = table.createField(command.viewId, command.field, command.at)

      await this.tableRepo.updateOneById(table.id.value, spec)

      const fts = new ForeignTableDomainService(this.tableRepo, table)
      await fts.handle(spec)

      await this.tableRepo.commit()
    } catch (error) {
      await this.tableRepo.rollback()
      throw error
    }
  }
}

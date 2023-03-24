import { ForeignTableDomainSpecificationVisitor, type ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@egodb/domain'
import type { CreateFieldCommand } from './create-field.command.js'

type ICreateFieldCommandHandler = ICommandHandler<CreateFieldCommand, void>

export class CreateFieldCommandHandler implements ICreateFieldCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async execute(command: CreateFieldCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const spec = table.createField(command.viewId, command.field, command.at)

    await this.tableRepo.updateOneById(table.id.value, spec)

    // TODO: optimize get foreign table logic
    if (
      command.field.type === 'reference' &&
      command.field.foreignTableId &&
      command.field.foreignTableId !== table.id.value
    ) {
      const foreignTable = (await this.tableRepo.findOneById(command.field.foreignTableId)).unwrap()
      const visitor = new ForeignTableDomainSpecificationVisitor(table, foreignTable)
      spec.accept(visitor)
      const foreignSpec = visitor.spec.into()
      if (foreignSpec) {
        foreignSpec.mutate(foreignTable)
        await this.tableRepo.updateOneById(foreignTable.id.value, foreignSpec)
      }
    }
  }
}

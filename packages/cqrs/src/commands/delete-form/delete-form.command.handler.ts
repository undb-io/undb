import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { DeleteFormCommand } from './delete-form.command.js'

type IDeleteFormCommandHandler = ICommandHandler<DeleteFormCommand, void>

export class DeleteFormCommandHandler implements IDeleteFormCommandHandler {
  constructor(protected readonly repo: ITableRepository) {}

  async execute(command: DeleteFormCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).unwrap()

    const spec = table.deleteForm(command.formId)

    if (spec.isSome()) {
      await this.repo.updateOneById(table.id.value, spec.unwrap())
    }
  }
}

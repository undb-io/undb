import type { IRecordRepository, ITableRepository } from '@undb/core'
import { createMutateRecordValuesSchema } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type * as updateRecordCommandJs from './update-record.command.js'

export class UpdateRecordCommandHandler implements ICommandHandler<updateRecordCommandJs.UpdateRecordCommand, void> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly recordRepo: IRecordRepository,
  ) {}

  async execute(command: updateRecordCommandJs.UpdateRecordCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    const record = (await this.recordRepo.findOneById(table, command.id)).unwrap()
    const schema = createMutateRecordValuesSchema(
      table.schema.fields.filter((field) => Object.keys(command.values).includes(field.id.value)),
    )

    const values = await schema.parseAsync(command.values)
    const spec = record.updateRecord(table.schema, values)

    await this.recordRepo.updateOneById(table, command.id, spec)
  }
}

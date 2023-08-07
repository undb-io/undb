import type { IClsService, IRecordRepository, ITableRepository, ITableSpecHandler } from '@undb/core'
import { TableFactory, WithTableSchema, createMutateRecordValuesSchema } from '@undb/core'
import { type ICommandHandler, type IUnitOfWork } from '@undb/domain'
import { chunk } from 'lodash-es'
import type { ICreateTableOutput } from './create-table.command.interface.js'
import type { CreateTableCommand } from './create-table.command.js'

type ICreateTableCommandHandler = ICommandHandler<CreateTableCommand, ICreateTableOutput>

export class CreateTableCommandHandler implements ICreateTableCommandHandler {
  constructor(
    protected readonly uow: IUnitOfWork,
    protected readonly tableRepo: ITableRepository,
    protected readonly recordRepo: IRecordRepository,
    protected readonly handler: ITableSpecHandler,
    protected readonly cls: IClsService,
  ) {}

  async execute(command: CreateTableCommand): Promise<ICreateTableOutput> {
    const userId = this.cls.get('user.userId')
    const ctx = this.cls.get()
    const table = TableFactory.from(command, ctx).unwrap()

    try {
      await this.uow.begin()

      await this.tableRepo.insert(table)
      await this.handler.handle(table, new WithTableSchema(table.schema))

      if (command.records?.length) {
        const schema = createMutateRecordValuesSchema(table.schema.fields).array()

        const chunked = chunk(command.records, 5000)
        for (const chunkRecords of chunked) {
          const values = await schema.parseAsync(chunkRecords)
          const records = table.createRecords(
            values.map((v) => ({ values: v })),
            userId,
          )
          await this.recordRepo.insertMany(table, records)
        }
      }

      await this.uow.commit()
    } catch (error) {
      await this.uow.rollback()
      throw error
    }

    return { id: table.id.value }
  }
}

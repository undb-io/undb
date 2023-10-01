import type { ClsStore, IClsService, IRecordRepository, ITableRepository } from '@undb/core'
import { BaseFactory, type BaseRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { TemplateFactory } from '@undb/template'
import type { CreateBaseCommand } from './create-base.command.js'

type ICreateBaseCommandHandler = ICommandHandler<CreateBaseCommand, void>

export class CreateBaseCommandHandler implements ICreateBaseCommandHandler {
  constructor(
    protected readonly cls: IClsService<ClsStore>,
    protected readonly repo: BaseRepository,
    protected readonly tableRepo: ITableRepository,
    protected readonly recordRepo: IRecordRepository,
  ) {}

  async execute(command: CreateBaseCommand): Promise<void> {
    const base = BaseFactory.new(command)

    await this.repo.insert(base)

    if (command.tableIds) {
      for (const tableId of command.tableIds) {
        const table = (await this.tableRepo.findOneById(tableId)).into()
        if (!table) continue

        const spec = table.moveToBase(base.id)

        if (spec.isSome()) {
          await this.tableRepo.updateOneById(table.id.value, spec.unwrap())
        }
      }
    } else if (command.template) {
      const userId = this.cls.get('user.userId')
      const template = TemplateFactory.fromJSON(command.template)
      const tables = template.export.toTables(userId, base.id.value)

      await Promise.all(
        tables.map(async ({ table, records }) => {
          await this.tableRepo.insert(table)
          if (records?.length) {
            await this.recordRepo.insertMany(table, records)
          }
        }),
      )
    }
  }
}

import type { IQueryRecords, IRecordQueryModel } from '@undb/core'
import { WithRecordIds, WithTableBaseId, type ITableRepository } from '@undb/core'
import type { Option } from 'oxide.ts'
import { TemplateFactory } from 'src/template.factory.js'
import type { Template } from '../template.js'

export interface ITemplateService {
  fromTable(tableId: string, recordIds?: string[]): Promise<Option<Template>>
  fromBase(baseId: string): Promise<Option<Template>>
}

export class TemplateService implements ITemplateService {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly recordRM: IRecordQueryModel,
  ) {}

  async fromTable(tableId: string, recordIds?: string[]): Promise<Option<Template>> {
    const table = (await this.tableRepo.findOneById(tableId)).unwrap()

    let records: IQueryRecords = []
    if (recordIds?.length) {
      records = await this.recordRM.find(table.id.value, undefined, WithRecordIds.fromIds(recordIds))
    }

    return TemplateFactory.fromTables([{ table, records: records }])
  }

  async fromBase(baseId: string): Promise<Option<Template>> {
    const tables = await this.tableRepo.find(WithTableBaseId.fromString(baseId))

    return TemplateFactory.fromTables(tables.map((table) => ({ table })))
  }
}

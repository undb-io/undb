import type { IQueryRecords, IRecordQueryModel } from '@undb/core'
import { WithRecordIds, type ITableRepository } from '@undb/core'
import type { Option } from 'oxide.ts'
import { TemplateFactory } from 'src/template.factory.js'
import type { Template } from '../template.js'

export interface ITemplateService {
  fromTable(tableId: string, recordIds?: string[]): Promise<Option<Template>>
}

export class TemplateService implements ITemplateService {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly recordQueryModel: IRecordQueryModel,
  ) {}

  async fromTable(tableId: string, recordIds?: string[]): Promise<Option<Template>> {
    const table = (await this.tableRepo.findOneById(tableId)).unwrap()

    let records: IQueryRecords = []
    if (recordIds?.length) {
      records = await this.recordQueryModel.find(tableId, undefined, WithRecordIds.fromIds(recordIds))
    }

    const template = TemplateFactory.fromTables([{ table, records }])

    return template
  }
}

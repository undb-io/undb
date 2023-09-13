import type { ITableRepository } from '@undb/core'
import type { Option } from 'oxide.ts'
import { TemplateFactory } from 'src/template.factory.js'
import type { Template } from '../template.js'

export interface ITemplateService {
  fromTable(tableId: string): Promise<Option<Template>>
}

export class TemplateService implements ITemplateService {
  constructor(protected readonly tableRepo: ITableRepository) {}

  async fromTable(tableId: string): Promise<Option<Template>> {
    const table = (await this.tableRepo.findOneById(tableId)).unwrap()

    const template = TemplateFactory.fromTables([table])

    return template
  }
}

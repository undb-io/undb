import { Injectable } from '@nestjs/common'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { createRedocHTML, createTableSchema } from '@undb/openapi'
import { InjectRecordReposiory, InjectTableReposiory } from '../modules/table/adapters/index.js'

@Injectable()
export class OpenAPIDocService {
  constructor(
    @InjectTableReposiory()
    private readonly repo: ITableRepository,
    @InjectRecordReposiory()
    private readonly recordRepo: IRecordRepository,
  ) {}
  public async generateDoc(tableId: string): Promise<string> {
    const table = (await this.repo.findOneById(tableId)).unwrap()
    const record = await this.recordRepo.findOne(tableId, null, table.schema.toIdMap())

    const spec = createTableSchema(table, record.into())
    const html = createRedocHTML(table, spec)

    return html
  }
}

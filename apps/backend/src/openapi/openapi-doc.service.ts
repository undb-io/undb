import { Injectable } from '@nestjs/common'
import { type IRecordQueryModel, type ITableRepository } from '@undb/core'
import { createRedocHTML, createTableSchema } from '@undb/openapi'
import { OpenAPIObject } from 'openapi3-ts/oas30'
import { InjectRecordQueryModel, InjectTableReposiory } from '../modules/table/adapters/index.js'

@Injectable()
export class OpenAPIDocService {
  constructor(
    @InjectTableReposiory()
    private readonly repo: ITableRepository,
    @InjectRecordQueryModel()
    private readonly recordRepo: IRecordQueryModel,
  ) {}

  public async getSpec(tableId: string): Promise<OpenAPIObject> {
    const table = (await this.repo.findOneById(tableId)).unwrap()
    const record = await this.recordRepo.findOne(tableId, null)

    const spec = createTableSchema(table, record.into())

    return spec
  }

  public async generateDoc(tableId: string): Promise<string> {
    const table = (await this.repo.findOneById(tableId)).unwrap()
    const record = await this.recordRepo.findOne(tableId, null)

    const spec = createTableSchema(table, record.into())

    const html = createRedocHTML(table, spec)

    return html
  }
}

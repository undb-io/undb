import { Injectable } from '@nestjs/common'
import type { Table } from '@undb/core'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { createRedocHTML, createTableSchema, type IPostmanCollectionConvertor } from '@undb/openapi'
import type { OpenAPIObject } from 'openapi3-ts/oas31'
import openapiTS, { OpenAPI3, astToString } from 'openapi-typescript'
import { InjectRecordRepository } from '../core/table/adapters/sqlite/record-sqlite.repository.js'
import { InjectTableRepository } from '../core/table/adapters/sqlite/table-sqlite.repository.js'
import { InjectPostmanConvertor } from './convertor/index.js'
import { match } from 'ts-pattern'

@Injectable()
export class OpenAPIDocService {
  constructor(
    @InjectTableRepository()
    private readonly repo: ITableRepository,
    @InjectRecordRepository()
    private readonly recordRepo: IRecordRepository,
    @InjectPostmanConvertor()
    private readonly postmanConvertor: IPostmanCollectionConvertor,
  ) {}

  public async getSpec(table: Table, host: string): Promise<OpenAPIObject> {
    const record = (await this.recordRepo.findOne(table, null)).into()

    const spec = createTableSchema(table, record, host)

    return spec
  }

  public async export(
    tableId: string,
    type: string | undefined,
    host: string,
  ): Promise<{ name: string; buffer: Buffer }> {
    const table = (await this.repo.findOneById(tableId)).unwrap()
    const spec = await this.getSpec(table, host)

    const data = await match(type)
      .returnType<Promise<{ content: string; ext: string }>>()
      .with('postman', async () => {
        const collection = await this.postmanConvertor.convert(spec)
        return {
          content: JSON.stringify(collection),
          ext: 'json',
        }
      })
      .with('typescript', async () => {
        const ast = await openapiTS(spec as OpenAPI3)
        const contents = astToString(ast)
        return {
          content: contents,
          ext: 'ts',
        }
      })
      .otherwise(async () => {
        const content = JSON.stringify(spec)
        return {
          content,
          ext: 'json',
        }
      })

    return { name: `${table.name.value}_openapi.${data.ext}`, buffer: Buffer.from(data.content) }
  }

  public async generateDoc(tableId: string, host: string): Promise<string> {
    const table = (await this.repo.findOneById(tableId)).unwrap()
    const spec = await this.getSpec(table, host)
    return createRedocHTML(table, spec)
  }
}

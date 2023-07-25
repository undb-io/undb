import { Injectable } from '@nestjs/common'
import type { IRecordRepository, Table } from '@undb/core'
import { type ITableRepository } from '@undb/core'
import { createRedocHTML, createTableSchema, type IPostmanCollectionConvertor } from '@undb/openapi'
import type { OpenAPIObject } from 'openapi3-ts/oas31'
import { InjectRecordRepository } from '../core/table/adapters/sqlite/record-sqlite.repository.js'
import { InjectTableRepository } from '../core/table/adapters/sqlite/table-sqlite.repository.js'
import { InjectPostmanConvertor } from './convertor/index.js'

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

    let buffer: Buffer
    if (type === 'postman') {
      const collection = await this.postmanConvertor.convert(spec)
      buffer = Buffer.from(JSON.stringify(collection))
    } else {
      buffer = Buffer.from(JSON.stringify(spec))
    }

    return { name: `${table.name.value}_openapi.json`, buffer }
  }

  public async generateDoc(tableId: string, host: string): Promise<string> {
    const table = (await this.repo.findOneById(tableId)).unwrap()
    const spec = await this.getSpec(table, host)
    return createRedocHTML(table, spec)
  }
}

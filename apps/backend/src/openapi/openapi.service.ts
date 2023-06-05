import { Injectable } from '@nestjs/common'
import { type ITableRepository } from '@undb/core'
import { createRedocHTML, createTableSchema } from '@undb/openapi'
import { InjectTableReposiory } from '../modules/table/adapters/index.js'

@Injectable()
export class OpenAPIService {
  constructor(
    @InjectTableReposiory()
    private readonly repo: ITableRepository,
  ) {}
  public async generateDoc(id: string): Promise<string> {
    const table = (await this.repo.findOneById(id)).unwrap()

    const spec = createTableSchema(table)
    const html = createRedocHTML(table, spec)

    return html
  }
}

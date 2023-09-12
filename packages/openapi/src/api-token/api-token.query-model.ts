import type { Option } from 'oxide.ts'
import type { IQueryApiToken } from './api-token.schema.js'
import type { ApiTokenSpecification } from './interface.js'

export interface IApiTokenQueryModel {
  find(spec: ApiTokenSpecification): Promise<IQueryApiToken[]>
  findOneById(id: string): Promise<Option<IQueryApiToken>>
}

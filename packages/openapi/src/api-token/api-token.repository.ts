import type { Option } from 'oxide.ts'
import type { ApiToken } from './api-token.js'
import type { ApiTokenSpecification } from './interface.js'

export interface IApiTokenRepository {
  find(spec: ApiTokenSpecification): Promise<ApiToken[]>
  findOneById(id: string): Promise<Option<ApiToken>>
  findOne(spec: ApiTokenSpecification): Promise<Option<ApiToken>>

  insert(token: ApiToken): Promise<void>
  deleteOneById(id: string): Promise<void>
}

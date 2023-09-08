import { Entity, PrimaryKey } from '@mikro-orm/core'
import { type ApiToken as ApiTokenDo } from '@undb/openapi'
import { BaseEntity } from './base.js'

@Entity({ tableName: 'undb_api_token' })
export class ApiToken extends BaseEntity {
  constructor(apiToken: ApiTokenDo) {
    super()
    this.id = apiToken.id.value
  }

  @PrimaryKey()
  id: string
}

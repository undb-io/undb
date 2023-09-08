import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { type ApiToken as ApiTokenDo } from '@undb/openapi'
import { BaseEntity } from './base.js'

@Entity({ tableName: 'undb_api_token' })
export class ApiToken extends BaseEntity {
  constructor(apiToken: ApiTokenDo) {
    super()
    this.id = apiToken.id.value
    this.token = apiToken.token.unpack()
  }

  @PrimaryKey()
  id: string

  @Property()
  token: string
}

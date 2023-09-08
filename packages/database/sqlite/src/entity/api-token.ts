import { Entity, ManyToOne, PrimaryKey, Property, type Rel } from '@mikro-orm/core'
import { type ApiToken as ApiTokenDo } from '@undb/openapi'
import { BaseEntity } from './base.js'
import { User } from './user.js'

@Entity({ tableName: 'undb_api_token' })
export class ApiToken extends BaseEntity {
  constructor(apiToken: ApiTokenDo, user: User) {
    super()
    this.id = apiToken.id.value
    this.token = apiToken.token.unpack()
    this.user = user
  }

  @PrimaryKey()
  id: string

  @Property()
  token: string

  @ManyToOne(() => User)
  user: Rel<User>
}

import type { User as CoreUser } from '@egodb/core'
import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { BaseEntity } from './base.js'

@Entity({ tableName: 'ego_user' })
export class User extends BaseEntity {
  constructor(user: CoreUser) {
    super()
    this.id = user.userId.value
    this.email = user.email
    this.username = user.username
    this.password = user.password
  }
  @PrimaryKey()
  id: string

  @Property()
  @Index()
  username: string

  @Property()
  @Index()
  @Unique()
  email: string

  @Property()
  password!: string
}

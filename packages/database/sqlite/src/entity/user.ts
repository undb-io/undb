import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { User as CoreUser, type IColor } from '@undb/core'
import { BaseEntity } from './base.entity.js'

export const USER_TABLE_NAME = 'undb_user'

@Entity({ tableName: USER_TABLE_NAME })
export class User extends BaseEntity {
  constructor(user: CoreUser) {
    super()
    this.id = user.userId.value
    this.email = user.email
    this.username = user.username
    this.password = user.password
    this.avatar = user.avatar
    this.color = user.color
  }
  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  avatar?: string | null

  @Property()
  @Index()
  username: string

  @Property({ default: 'blue' })
  color: IColor

  @Property()
  @Index()
  @Unique()
  email: string

  @Property()
  password: string
}

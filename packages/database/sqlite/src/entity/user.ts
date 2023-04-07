import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { BaseEntity } from './base.js'

@Entity({ tableName: 'ego_user' })
export class User extends BaseEntity {
  @PrimaryKey()
  id!: string

  @Property()
  @Index()
  username!: string

  @Property()
  @Index()
  @Unique()
  email!: string

  @Property()
  password!: string
}

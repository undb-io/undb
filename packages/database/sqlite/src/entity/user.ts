import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from './base.js'

@Entity({ tableName: 'ego_user' })
export class User extends BaseEntity {
  @PrimaryKey()
  id!: string

  @Property()
  @Index()
  username!: string

  @Property()
  password!: string
}

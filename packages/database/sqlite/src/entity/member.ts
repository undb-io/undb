import { Entity, ManyToOne, PrimaryKey, Property, type Rel } from '@mikro-orm/core'
import { Member as MemberDO } from '@undb/authz'
import { BaseEntity } from './base.entity.js'
import { User } from './user.js'

@Entity({ tableName: 'undb_member' })
export class Member extends BaseEntity {
  constructor(member: MemberDO, user: Rel<User>) {
    super()
    this.id = member.id.value
    this.role = member.role.unpack()
    this.user = user
  }

  @PrimaryKey()
  id: string

  @Property()
  role: string

  @ManyToOne(() => User)
  user: Rel<User>
}

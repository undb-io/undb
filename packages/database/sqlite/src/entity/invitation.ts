import { Entity, Index, ManyToOne, PrimaryKey, Property, Unique, type Rel } from '@mikro-orm/core'
import { Invitation as InvitationDo } from '@undb/integrations'
import { BaseEntity } from './base.entity.js'
import { User } from './user.js'

@Entity({
  tableName: 'undb_invitation',
})
export class Invitation extends BaseEntity {
  constructor(invitation: InvitationDo, invitedBy: Rel<User>) {
    super()

    this.id = invitation.id.value
    this.email = invitation.email.unpack()
    this.role = invitation.role.unpack()
    this.expiredAt = invitation.expiredAt.value
    this.status = invitation.status.unpack()
    this.invitedBy = invitedBy
    this.invitedAt = invitation.invitedAt.value
  }

  @PrimaryKey()
  id: string

  @Property()
  @Index()
  @Unique()
  email: string

  @Property()
  role: string

  @Property()
  expiredAt: Date

  @Property()
  status: string

  @ManyToOne(() => User)
  invitedBy: Rel<User>

  @Property()
  invitedAt: Date

  @ManyToOne(() => User, { nullable: true })
  cancelledBy?: Rel<User>

  @Property({ nullable: true })
  cancelldAt?: Date

  @Property({ nullable: true })
  acceptedAt?: Date
}

import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { Invitation as InvitationDo } from '@undb/integrations'
import { BaseEntity } from './base.js'

@Entity({
  tableName: 'undb_invitation',
})
export class Invitation extends BaseEntity {
  constructor(invitation: InvitationDo) {
    super()

    this.id = invitation.id.value
    this.email = invitation.email.unpack()
    this.role = invitation.role.unpack()
    this.expiredAt = invitation.expiredAt.value
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
}

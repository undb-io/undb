import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { Invitation as InvitationDo } from '@undb/integrations'

@Entity({
  tableName: 'undb_invitation',
})
export class Invitation {
  constructor(invitation: InvitationDo) {
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

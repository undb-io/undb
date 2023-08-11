import { Entity, PrimaryKey } from '@mikro-orm/core'
import { Invitation as InvitationDo } from '@undb/integrations'

@Entity({
  tableName: 'undb_invitation',
})
export class Invitation {
  constructor(invitation: InvitationDo) {
    this.id = invitation.id.value
  }

  @PrimaryKey()
  id: string
}

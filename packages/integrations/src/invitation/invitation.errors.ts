import { ExceptionBase } from '@undb/domain'

export class InvitationExpired extends ExceptionBase {
  code = 'INVITATION.EXPIRED'

  constructor(date: Date) {
    super('invitation is already expired at ' + date.toISOString())
  }
}

export class InvitationCancelled extends ExceptionBase {
  code = 'INVITATION.CANCELLED'

  constructor() {
    super('invitation is already cancelled')
  }
}

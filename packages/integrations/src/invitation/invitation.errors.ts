import { ExceptionBase } from '@undb/domain'

export class UserAlreadyExists extends ExceptionBase {
  code = 'INVITATION.USER_ALREADY_EXISTS'

  constructor(email: string) {
    super(`user with email ${email} has already exists in system`)
  }
}

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

export class InvitationAccepted extends ExceptionBase {
  code = 'INVITATION.ACCEPTED'

  constructor() {
    super('invitation is already accepted')
  }
}

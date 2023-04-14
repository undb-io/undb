import { ExceptionBase } from '@undb/domain'

export class UserNotFound extends ExceptionBase {
  code = 'AUTH.USER_NOT_FOUND'

  constructor() {
    super('user not found')
  }
}

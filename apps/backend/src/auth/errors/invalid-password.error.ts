import { ExceptionBase } from '@undb/domain'

export class InvalidPassword extends ExceptionBase {
  code = 'AUTH.INVALID_PASSWORD'

  constructor() {
    super('invalid password')
  }
}

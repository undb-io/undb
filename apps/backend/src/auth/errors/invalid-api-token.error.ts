import { ExceptionBase } from '@undb/domain'

export class InvalidApiToken extends ExceptionBase {
  code = 'AUTH.INVALID_API_TOKEN'

  constructor() {
    super('invalid api token')
  }
}

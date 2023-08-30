import { ExceptionBase } from '@undb/domain'

export class FLSNotAuthorized extends ExceptionBase {
  code = 'FLS.NOT_AUHORIZED'

  constructor() {
    super('fls not authorized')
  }
}

import { ExceptionBase } from '@undb/domain'

export class RLSNotAuthorized extends ExceptionBase {
  code = 'RLS.NOT_AUHORIZED'

  constructor() {
    super('rls not authorized')
  }
}

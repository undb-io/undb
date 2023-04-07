import { ExceptionBase } from '@egodb/domain'

export class InvalidTableIdError extends ExceptionBase {
  code = 'TABLE.INVALID_ID'

  constructor() {
    super('invalid table id')
  }
}

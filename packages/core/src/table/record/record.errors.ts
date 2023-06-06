import { ExceptionBase } from '@undb/domain'

export class RecordNotFoundException extends ExceptionBase {
  code = 'RECORD.NOT_FOUNT'

  constructor() {
    super('record not found')
  }
}

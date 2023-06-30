import { ExceptionBase } from '@undb/domain'

export class NotFoundShare extends ExceptionBase {
  code = 'SHARE.NOT_FOUND'

  constructor() {
    super('Share not found')
  }
}

export class ShareNotEnabled extends ExceptionBase {
  code = 'SHARE.NOT_ENABLED'

  constructor() {
    super('Share not enabled')
  }
}

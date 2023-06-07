import { ExceptionBase } from '@undb/domain'

export class InvalidTableIdError extends ExceptionBase {
  code = 'TABLE.INVALID_ID'

  constructor() {
    super('invalid table id')
  }
}

export const ERR_TABLE_NODE_FOUND = 'TABLE.NOT_FOUND'

export class TableNotFoundError extends ExceptionBase {
  code = ERR_TABLE_NODE_FOUND

  constructor() {
    super('table not found')
  }
}

import { ExceptionBase } from '@undb/domain'

export class FieldNotFoundException extends ExceptionBase {
  code = 'FIELD.NOT_FOUNT'

  constructor() {
    super('field not found')
  }
}

export class FieldCannotBeDuplicated extends ExceptionBase {
  code = 'FIELD.CANNOT_BE_DUPLICATED'

  constructor() {
    super('field cannot be duplicated')
  }
}

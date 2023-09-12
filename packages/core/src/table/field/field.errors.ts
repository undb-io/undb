import { ExceptionBase } from '@undb/domain'
import type { IFieldType } from './field.type.js'
import { searchableFieldTypes } from './field.util.js'

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

export class FieldTypeNotSearchable extends ExceptionBase {
  code = 'FIELD.NOT_SEARCHABLE'

  constructor(type: IFieldType) {
    super(
      `field of type ${type} is not searchable, the valid searchable field types are ${[
        ...searchableFieldTypes.values(),
      ]}`,
    )
  }
}

export class CannotSetFieldDisplayException extends ExceptionBase {
  code = 'FIELD.CANNOT_SET_FIELD_DISPLAY'

  constructor(type: IFieldType) {
    super(`cannot set field of type ${type} display`)
  }
}

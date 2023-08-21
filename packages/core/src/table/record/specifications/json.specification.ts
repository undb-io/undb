import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { JsonFieldValue } from '../../field/index.js'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'
import { BaseRecordSpecification } from './record-specification.base.js'

export class JsonEmpty extends BaseRecordSpecification<JsonFieldValue> {
  constructor(fieldId: string) {
    super(fieldId, new JsonFieldValue(null))
  }
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)

    return value instanceof JsonFieldValue && value.equals(this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.jsonEmpty(this)
    return Ok(undefined)
  }
}

export class JsonEqual extends BaseRecordSpecification<JsonFieldValue> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)

    return value instanceof JsonFieldValue && value.equals(this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    throw new Error('Method not implemented.')
  }
}

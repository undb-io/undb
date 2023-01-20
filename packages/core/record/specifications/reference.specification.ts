import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { ReferenceFieldValue } from '../../field'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'
import { BaseRecordSpecification } from './record-specification.base'

export class ReferenceEqual extends BaseRecordSpecification<ReferenceFieldValue> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    return value instanceof ReferenceFieldValue && value.equals(this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.referenceEqual(this)
    return Ok(undefined)
  }
}

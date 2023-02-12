import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { NumberFieldValue } from '../../field/number-field-value.js'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'
import { BaseRecordSpecification } from './record-specification.base.js'

export class NumberEqual extends BaseRecordSpecification<NumberFieldValue> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    return value instanceof NumberFieldValue && value.equals(this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.numberEqual(this)
    return Ok(undefined)
  }
}

export class NumberGreaterThan extends BaseRecordSpecification<NumberFieldValue> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof NumberFieldValue)) return false
    const n1 = value.unpack()
    const n2 = this.value.unpack()
    return n1 !== null && n2 !== null && n1 > n2
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.numberGreaterThan(this)
    return Ok(undefined)
  }
}

export class NumberLessThan extends BaseRecordSpecification<NumberFieldValue> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof NumberFieldValue)) return false
    const n1 = value.unpack()
    const n2 = this.value.unpack()
    return n1 !== null && n2 !== null && n1 < n2
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.numberLessThan(this)
    return Ok(undefined)
  }
}

export class NumberGreaterThanOrEqual extends BaseRecordSpecification<NumberFieldValue> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof NumberFieldValue)) return false
    const n1 = value.unpack()
    const n2 = this.value.unpack()
    return n1 !== null && n2 !== null && n1 >= n2
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.numberGreaterThanOrEqual(this)
    return Ok(undefined)
  }
}

export class NumberLessThanOrEqual extends BaseRecordSpecification<NumberFieldValue> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof NumberFieldValue)) return false
    const n1 = value.unpack()
    const n2 = this.value.unpack()
    return n1 !== null && n2 !== null && n1 <= n2
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.numberLessThanOrEqual(this)
    return Ok(undefined)
  }
}

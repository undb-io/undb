import { CompositeSpecification } from '@undb/domain'
import { isNil, isNumber } from 'lodash-es'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { NumberFieldValue } from '../../field/fields/number/number-field-value.js'
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
    if (n1 === null && isNumber(n2)) return true
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
    if (n1 === null && isNumber(n2)) return true
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

export class NumberEmpty extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly fieldId: string) {
    super()
  }

  mutate(r: Record): Result<Record, string> {
    r.values.setValue(this.fieldId, new NumberFieldValue(null))
    return Ok(r)
  }

  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    return value instanceof NumberFieldValue && isNil(value.unpack())
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.numberEmpty(this)
    return Ok(undefined)
  }
}

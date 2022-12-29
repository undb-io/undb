import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { NumberFieldValue } from '../../field/number-field-value'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'

abstract class BaseNumberSpecification extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(readonly name: string, readonly value: number) {
    super()
  }

  mutate(r: Record): Result<Record, string> {
    const numberValue = new NumberFieldValue(this.value)
    r.values.setValue(this.name, numberValue)
    return Ok(r)
  }
}

export class NumberEqual extends BaseNumberSpecification {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getNumberValue(this.name).mapOr(false, (value) => value === this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.numberEqual(this)
    return Ok(undefined)
  }
}

export class NumberGreaterThan extends BaseNumberSpecification {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getNumberValue(this.name).mapOr(false, (value) => value > this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.numberGreaterThan(this)
    return Ok(undefined)
  }
}

export class NumberLessThan extends BaseNumberSpecification {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getNumberValue(this.name).mapOr(false, (value) => value < this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.numberLessThan(this)
    return Ok(undefined)
  }
}

export class NumberGreaterThanOrEqual extends BaseNumberSpecification {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getNumberValue(this.name).mapOr(false, (value) => value >= this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.numberGreaterThanOrEqual(this)
    return Ok(undefined)
  }
}

export class NumberLessThanOrEqual extends BaseNumberSpecification {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getNumberValue(this.name).mapOr(false, (value) => value <= this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.numberLessThanOrEqual(this)
    return Ok(undefined)
  }
}

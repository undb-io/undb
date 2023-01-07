import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { StringFieldValue } from '../../field/string-field-value'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'

abstract class BaseStringSpecification extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(readonly field: string, readonly value: string | null) {
    super()
  }

  mutate(r: Record): Result<Record, string> {
    const stringValue = new StringFieldValue(this.value)
    r.values.setValue(this.field, stringValue)
    return Ok(r)
  }
}

export class StringEqual extends BaseStringSpecification {
  /**
   * check given string is equal to record value by field name
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    return r.values.getStringValue(this.field).mapOr(false, (value) => value === this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.stringEqual(this)
    return Ok(undefined)
  }
}

export class StringContain extends BaseStringSpecification {
  /**
   * check whether record value by field name contains given string
   * @param r - record
   * @returns
   */
  isSatisfiedBy(r: Record): boolean {
    return r.values
      .getStringValue(this.field)
      .mapOr(false, (value) => this.value !== null && value.includes(this.value))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.stringContain(this)
    return Ok(undefined)
  }
}

export class StringStartsWith extends BaseStringSpecification {
  /**
   * check whether string starts with given value
   * @param r - record
   * @returns boolean
   */
  isSatisfiedBy(r: Record): boolean {
    return r.values
      .getStringValue(this.field)
      .mapOr(false, (value) => this.value !== null && value.startsWith(this.value))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.stringStartsWith(this)
    return Ok(undefined)
  }
}

export class StringEndsWith extends BaseStringSpecification {
  /**
   * check whether string ends with given value
   * @param r - record
   * @returns boolean
   */
  isSatisfiedBy(r: Record): boolean {
    return r.values
      .getStringValue(this.field)
      .mapOr(false, (value) => this.value !== null && value.endsWith(this.value))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.stringEndsWith(this)
    return Ok(undefined)
  }
}

export class StringRegex extends BaseStringSpecification {
  /**
   * check whether string match given regex
   * @param r - record
   * @returns boolean
   */
  isSatisfiedBy(r: Record): boolean {
    return r.values
      .getStringValue(this.field)
      .mapOr(false, (value) => this.value !== null && new RegExp(this.value).test(value))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.stringRegex(this)
    return Ok(undefined)
  }
}

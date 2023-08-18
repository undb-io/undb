import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { StringFieldValue } from '../../field/fields/string/string-field-value.js'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'
import { BaseRecordSpecification } from './record-specification.base.js'

export class StringEqual extends BaseRecordSpecification<StringFieldValue> {
  /**
   * check given string is equal to record value by field name
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)

    return value instanceof StringFieldValue && this.value.equals(value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.stringEqual(this)
    return Ok(undefined)
  }
}

export class StringContain extends BaseRecordSpecification<StringFieldValue> {
  /**
   * check whether record value by field name contains given string
   * @param r - record
   * @returns
   */
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof StringFieldValue)) return false

    const s1 = value.unpack()
    const s2 = this.value.unpack()
    return !!s1 && !!s2 && s1.includes(s2)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.stringContain(this)
    return Ok(undefined)
  }
}

export class StringStartsWith extends BaseRecordSpecification<StringFieldValue> {
  /**
   * check whether string starts with given value
   * @param r - record
   * @returns boolean
   */
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof StringFieldValue)) return false

    const s1 = value.unpack()
    const s2 = this.value.unpack()
    return !!s1 && !!s2 && s1.startsWith(s2)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.stringStartsWith(this)
    return Ok(undefined)
  }
}

export class StringEndsWith extends BaseRecordSpecification<StringFieldValue> {
  /**
   * check whether string ends with given value
   * @param r - record
   * @returns boolean
   */
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof StringFieldValue)) return false

    const s1 = value.unpack()
    const s2 = this.value.unpack()
    return !!s1 && !!s2 && s1.endsWith(s2)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.stringEndsWith(this)
    return Ok(undefined)
  }
}

export class StringRegex extends BaseRecordSpecification<StringFieldValue> {
  /**
   * check whether string match given regex
   * @param r - record
   * @returns boolean
   */
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof StringFieldValue)) return false

    const s1 = value.unpack()
    const s2 = this.value.unpack()
    return !!s1 && !!s2 && new RegExp(s2).test(s1)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.stringRegex(this)
    return Ok(undefined)
  }
}

export class StringEmpty extends BaseRecordSpecification<StringFieldValue> {
  constructor(fieldId: string) {
    super(fieldId, new StringFieldValue(null))
  }

  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (value instanceof StringFieldValue) return !value.unpack()
    return !value
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.stringEmpty(this)
    return Ok(undefined)
  }
}

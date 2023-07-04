import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { MultiSelectFieldValue } from '../../field/fields/multi-select/multi-select-field-value.js'
import type { IMultiSelectFieldValue } from '../../field/index.js'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'
import { BaseRecordSpecification } from './record-specification.base.js'

export class MultiSelectEqual extends BaseRecordSpecification<MultiSelectFieldValue> {
  static from(fieldId: string, value: IMultiSelectFieldValue): MultiSelectEqual {
    return new this(fieldId, new MultiSelectFieldValue(value))
  }

  static fromStrings(fieldId: string, values: string[]): MultiSelectEqual {
    return new this(fieldId, new MultiSelectFieldValue(values))
  }

  isSatisfiedBy(r: Record): boolean {
    throw new Error('not implemented')
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.multiSelectEqual(this)
    return Ok(undefined)
  }
}

export class MultiSelectIsEmpty extends BaseRecordSpecification<MultiSelectFieldValue> {
  constructor(fieldId: string) {
    super(fieldId, new MultiSelectFieldValue(null))
  }

  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)

    return value instanceof MultiSelectFieldValue && value.equals(this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.multiSelectIsEmpty(this)
    return Ok(undefined)
  }
}

export class MultiSelectIn extends BaseRecordSpecification<MultiSelectFieldValue> {
  static from(fieldId: string, value: IMultiSelectFieldValue): MultiSelectEqual {
    return new this(fieldId, new MultiSelectFieldValue(value))
  }

  static fromStrings(fieldId: string, values: string[]): MultiSelectEqual {
    return new this(fieldId, new MultiSelectFieldValue(values))
  }

  isSatisfiedBy(r: Record): boolean {
    throw new Error('not implemented')
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.multiSelectIn(this)
    return Ok(undefined)
  }
}

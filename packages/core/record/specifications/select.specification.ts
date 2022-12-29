import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { SelectFieldValue } from '../../field/select-field-value'
import type { ISelectFieldValue } from '../../field/select-field.type'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'
import { RecordValueQuerySpecification } from './record-value-specification.base'

abstract class BaseSelectSpecification extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(readonly name: string, readonly value: ISelectFieldValue) {
    super()
  }

  mutate(r: Record): Result<Record, string> {
    const selectFieldValue = new SelectFieldValue(this.value)
    r.values.setValue(this.name, selectFieldValue)
    return Ok(r)
  }
}

export class SelectEqual extends BaseSelectSpecification {
  /**
   * check given select is equal to record value by field name
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    return r.values.getSelectValue(this.name).mapOr(false, (value) => value.id === this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.selectEqual(this)
    return Ok(undefined)
  }
}

export class SelectIn extends RecordValueQuerySpecification<ISelectFieldValue[]> {
  /**
   * check given select is equal to record value by field name
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    return r.values.getSelectValue(this.name).mapOr(false, (value) => !!value.id && this.value.includes(value.id))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.selectIn(this)
    return Ok(undefined)
  }
}

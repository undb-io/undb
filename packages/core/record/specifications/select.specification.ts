import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ISelectFieldValue } from '../../field/select-field.type'
import { Option } from '../../option/option'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'
import { RecordValueQuerySpecification } from './record-value-specification.base'

abstract class BaseSelectSpecification extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(readonly name: string, readonly value: ISelectFieldValue) {
    super()
  }

  mutate(r: Record): Result<Record, string> {
    const option = Option.create(this.value)
    r.values.set(this.name, option)
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
    return r.values.getSelectValue(this.name).mapOr(false, (value) => value.option === this.value.name)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.selectEqual(this)
    return Ok(undefined)
  }
}

export class SelectIn extends RecordValueQuerySpecification<string[]> {
  /**
   * check given select is equal to record value by field name
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    return r.values
      .getSelectValue(this.name)
      .mapOr(false, (value) => !!value.option && this.value.includes(value.option))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.selectIn(this)
    return Ok(undefined)
  }
}

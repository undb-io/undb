import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { ReferenceFieldValue } from '../../field'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'

abstract class BaseReferenceSpecification extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(readonly fieldId: string, readonly value: string[] | null) {
    super()
  }

  mutate(r: Record): Result<Record, string> {
    const referenceValue = new ReferenceFieldValue(this.value)
    r.values.setValue(this.fieldId, referenceValue)
    return Ok(r)
  }
}

export class ReferenceEqual extends BaseReferenceSpecification {
  isSatisfiedBy(r: Record): boolean {
    return r.values
      .getReferenceValue(this.fieldId)
      .mapOr(false, (value) => (value ? JSON.stringify(value) === JSON.stringify(this.value) : value === this.value))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.referenceEqual(this)
    return Ok(undefined)
  }
}

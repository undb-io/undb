import { CompositeSpecification } from '@egodb/domain/dist'
import type { Result } from 'oxide.ts'
import type { ITextFieldValue } from '../../field/text-field.type'
import type { TextField } from '../../field/text.field'
import type { Record } from '../record'
import type { IRecordSpec } from './interface'

export class TextEqual extends CompositeSpecification<Record, IRecordSpec> {
  constructor(readonly field: TextField, readonly value: ITextFieldValue) {
    super()
  }

  isSatisfiedBy(r: Record): boolean {
    return r.values.getTextValue(this.field).mapOr(false, (value) => value === this.value)
  }

  mutate(t: Record): Result<Record, string> {
    throw new Error('Method not implemented.')
  }

  accept(v: IRecordSpec): Result<void, string> {
    throw new Error('Method not implemented.')
  }
}

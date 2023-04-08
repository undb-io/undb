/* eslint-disable @typescript-eslint/no-unused-vars */
import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record.js'
import type { IRecordDisplayValues } from '../record.type.js'
import { RecordDisplayValues } from '../value-objects/record-display-values.vo.js'
import type { IRecordVisitor } from './interface.js'

export class WithDisplayValues extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly values: RecordDisplayValues) {
    super()
  }

  static from(values: IRecordDisplayValues): WithDisplayValues {
    return new this(new RecordDisplayValues(values))
  }

  isSatisfiedBy(t: Record): boolean {
    throw new Error('[WithDisplayValues.isSatisfiedBy] not implemented')
  }

  mutate(r: Record): Result<Record, string> {
    r.displayValues = this.values
    return Ok(r)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    return Ok(undefined)
  }
}

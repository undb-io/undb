import { CompositeSpecification } from '@undb/domain'
import type { Option, Result } from 'oxide.ts'
import { None, Ok, Some } from 'oxide.ts'
import type { IFieldType } from '../../field/field.type.js'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'

export class WithRecordLike extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(
    public readonly type: IFieldType,
    public readonly fieldId: string,
    public readonly q: string,
  ) {
    super()
  }

  isSatisfiedBy(r: Record): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(r: Record): Result<Record, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.like(this)
    return Ok(undefined)
  }
}

export class WithQ extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly q: string) {
    super()
  }

  isSatisfiedBy(r: Record): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(r: Record): Result<Record, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.search(this)
    return Ok(undefined)
  }
}

export const withQ = (q?: string): Option<WithQ> => {
  if (!q) return None

  return Some(new WithQ(q))
}

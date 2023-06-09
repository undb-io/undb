import { CompositeSpecification, or } from '@undb/domain'
import type { Option, Result } from 'oxide.ts'
import { None, Ok } from 'oxide.ts'
import type { IFieldType } from '../../field/field.type.js'
import type { Table } from '../../table.js'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'

export class WithRecordLike extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly type: IFieldType, public readonly fieldId: string, public readonly q: string) {
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

export const withQ = (table: Table, q?: string): Option<CompositeSpecification<Record, IRecordVisitor>> => {
  if (!q) return None

  const fields = table.schema.searchableFields
  if (!fields.length) return None

  const specs = fields.map((field) => new WithRecordLike(field.type, field.id.value, q))

  return or(...specs)
}

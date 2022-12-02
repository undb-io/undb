import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Table } from '../table'
import { TableId } from '../value-objects'
import type { ITableSpecVisitor } from './interface'

export class WithTableId extends CompositeSpecification {
  constructor(public readonly id: TableId) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    return this.id.equals(t.id)
  }

  mutate(t: Table): Result<Table, string> {
    t.id = this.id
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.idEqual(this)
    return Ok(undefined)
  }
}

export const WithTableIdS = (id: string) => new WithTableId(TableId.from(id))

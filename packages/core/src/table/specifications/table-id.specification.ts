import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Table } from '../table.js'
import { TableId } from '../value-objects/index.js'
import type { ITableSpecVisitor } from './interface.js'

export class WithTableId extends CompositeSpecification {
  constructor(public readonly id: TableId) {
    super()
  }

  static fromString(id?: string): WithTableId {
    return new WithTableId(TableId.fromOrCreate(id))
  }

  static fromExistingString(id: string) {
    return TableId.from(id).map((id) => new WithTableId(id))
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

export class WithTableIds extends CompositeSpecification {
  constructor(public readonly ids: TableId[]) {
    super()
  }

  static fromIds(ids: string[]): WithTableIds {
    return new this(ids.map((id) => TableId.from(id).unwrap()))
  }

  isSatisfiedBy(t: Table): boolean {
    throw new Error('not implemented')
  }

  mutate(t: Table): Result<Table, string> {
    throw new Error('not implemented')
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.idsIn(this)
    return Ok(undefined)
  }
}

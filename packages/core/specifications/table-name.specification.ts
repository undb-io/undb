import { Ok, type Result } from 'oxide.ts'
import { type Table } from '../table'
import { TableName } from '../value-objects/table-name.vo'
import type { ITableSpec, ITableSpecVisitor } from './interface'

export class WithName implements ITableSpec {
  constructor(public readonly name: TableName) {}

  isSatisfiedBy(t: Table): boolean {
    return this.name.equals(t.name)
  }

  mutate(t: Table): Result<Table, string> {
    t.name = this.name
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.nameEqual(this)
    return Ok(undefined)
  }
}

export const withNameS = (name: string) => new WithName(new TableName(name))

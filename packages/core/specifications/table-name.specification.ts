import { CompositeSpecification } from '@egodb/domain'
import { Ok, type Result } from 'oxide.ts'
import { type Table } from '../table'
import { TableName } from '../value-objects'
import type { ITableSpecVisitor } from './interface'

export class WithName extends CompositeSpecification {
  constructor(public readonly name: TableName) {
    super()
  }

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

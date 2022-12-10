import type { ITableSpec, ITableSpecVisitor, WithName, WithTableId } from '@egodb/core'
import type { Result } from 'oxide.ts'
import { Err, Ok } from 'oxide.ts'
import type { TableInMemory } from './table'

type TableInMemoryPredicate = (value: TableInMemory, index: number, obj: TableInMemory[]) => unknown

export class TableInMemoryQueryVisitor implements ITableSpecVisitor {
  private predicate?: TableInMemoryPredicate

  getPredicate(): Result<TableInMemoryPredicate, Error> {
    if (!this.predicate) {
      return Err(new Error('missing predicate'))
    }

    return Ok(this.predicate)
  }

  and(ss: ITableSpec[]): void {
    const ps = ss.map((s) => {
      const visitor = new TableInMemoryQueryVisitor()
      s.accept(visitor)
      return visitor.getPredicate().unwrap()
    })

    this.predicate = (...args) => ps.every((p) => p(...args))
  }

  idEqual(s: WithTableId): void {
    this.predicate = (t) => t.id === s.id.value
  }

  nameEqual(s: WithName): void {
    this.predicate = (t) => t.name === s.name.value
  }

  filtersEqual(): void {
    throw new Error('cannot query by filters')
  }
}

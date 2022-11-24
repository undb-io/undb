import { ITableSpecVisitor } from '@egodb/core/dist/specifications/interface'
import { WithName } from '@egodb/core/dist/specifications/table-name.specification'
import { Err, Ok, Result } from 'oxide.ts'
import { TableInMemory } from './table'

type TableInMemoryPredicate = (value: TableInMemory, index: number, obj: TableInMemory[]) => unknown

export class TableInMemoryQueryVisitor implements ITableSpecVisitor {
  public predicate?: TableInMemoryPredicate

  mustGetPredicate(): Result<TableInMemoryPredicate, Error> {
    if (!this.predicate) {
      return Err(new Error('missing predicate'))
    }

    return Ok(this.predicate)
  }

  nameEqual(s: WithName): void {
    this.predicate = (t) => t.name === s.name.value
  }
}

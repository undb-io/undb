import type { IRecordSpec, IRecordSpecVisitor, WithRecordId } from '@egodb/core'
import type { Result } from 'oxide.ts'
import { Err, Ok } from 'oxide.ts'
import type { RecordInMemory } from './record.type'

type RecordInMemoryPredicate = (value: RecordInMemory, index: number, obj: RecordInMemory[]) => unknown

export class RecordInMemoryQueryVisitor implements IRecordSpecVisitor {
  private predicate?: RecordInMemoryPredicate

  getPredicate(): Result<RecordInMemoryPredicate, Error> {
    if (!this.predicate) {
      return Err(new Error('missing predicate'))
    }

    return Ok(this.predicate)
  }

  and(ss: IRecordSpec[]): void {
    const ps = ss.map((s) => {
      const visitor = new RecordInMemoryQueryVisitor()
      s.accept(visitor)
      return visitor.getPredicate().unwrap()
    })

    this.predicate = (...args) => ps.every((p) => p(...args))
  }

  idEqual(s: WithRecordId): void {
    this.predicate = (t) => t.id === s.id.value
  }
}

import type {
  IRecordSpec,
  IRecordVisitor,
  NumberEqual,
  StringContain,
  StringEqual,
  WithRecordId,
  WithRecordTableId,
} from '@egodb/core'
import { contains, isNumber, isString } from '@fxts/core'
import type { Result } from 'oxide.ts'
import { Err, Ok } from 'oxide.ts'
import type { RecordInMemory } from './record.type'

type RecordInMemoryPredicate = (value: RecordInMemory, index: number, obj: RecordInMemory[]) => unknown

export class RecordInMemoryQueryVisitor implements IRecordVisitor {
  private predicate?: RecordInMemoryPredicate

  getPredicate(): Result<RecordInMemoryPredicate, Error> {
    if (!this.predicate) {
      return Err(new Error('record in memory visitor missing predicate'))
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
    this.predicate = (r) => r.id === s.id.value
  }

  tableIdEqual(s: WithRecordTableId): void {
    this.predicate = (r) => r.tableId === s.id.value
  }

  stringEqual(s: StringEqual): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isString(value) && s.value === value
    }
  }

  numberEqual(s: NumberEqual): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isNumber(value) && value === s.value
    }
  }

  stringContain(s: StringContain): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isString(value) && contains(s.value, value)
    }
  }
}

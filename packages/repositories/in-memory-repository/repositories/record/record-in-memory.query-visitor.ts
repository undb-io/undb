import type {
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateLessThan,
  DateLessThanOrEqual,
  IRecordSpec,
  IRecordVisitor,
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
  StringContain,
  StringEndsWith,
  StringEqual,
  StringRegex,
  StringStartsWith,
  WithRecordCreatedAt,
  WithRecordId,
  WithRecordTableId,
} from '@egodb/core'
import { isNumber, isString } from '@fxts/core'
import { isAfter, isBefore, isDate, isEqual } from 'date-fns'
import type { Result } from 'oxide.ts'
import { Err, Ok } from 'oxide.ts'
import type { RecordInMemory } from './record.type'

type RecordInMemoryPredicate = (value: RecordInMemory, index: number, obj: RecordInMemory[]) => unknown
const opposite =
  (fn: RecordInMemoryPredicate) =>
  (...args: Parameters<RecordInMemoryPredicate>): boolean =>
    !fn(...args)

export class RecordInMemoryQueryVisitor implements IRecordVisitor {
  private predicate?: RecordInMemoryPredicate
  private isOpposite = false

  getPredicate(): Result<RecordInMemoryPredicate, Error> {
    if (!this.predicate) {
      return Err(new Error('record in memory visitor missing predicate'))
    }

    if (this.isOpposite) {
      return Ok(opposite(this.predicate))
    }

    return Ok(this.predicate)
  }

  not(): this {
    this.isOpposite = !this.isOpposite
    return this
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
      return isString(value) && value.includes(s.value)
    }
  }

  stringStartsWith(s: StringStartsWith): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isString(value) && value.startsWith(s.value)
    }
  }

  stringEndsWith(s: StringEndsWith): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isString(value) && value.endsWith(s.value)
    }
  }

  stringRegex(s: StringRegex): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isString(value) && new RegExp(s.value).test(value)
    }
  }

  numberGreaterThan(s: NumberGreaterThan): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isNumber(value) && value > s.value
    }
  }
  numberLessThan(s: NumberLessThan): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isNumber(value) && value < s.value
    }
  }

  numberGreaterThanOrEqual(s: NumberGreaterThanOrEqual): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isNumber(value) && value >= s.value
    }
  }

  numberLessThanOrEqual(s: NumberLessThanOrEqual): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isNumber(value) && value <= s.value
    }
  }

  createdAt(s: WithRecordCreatedAt): void {
    this.predicate = (r) => {
      const value = r.createdAt
      return isDate(value) && isEqual(value, s.date.unpack())
    }
  }

  dateEqual(s: DateEqual): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isDate(value) && isEqual(value as Date, s.value)
    }
  }

  dateGreaterThan(s: DateGreaterThan): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isDate(value) && isAfter(value as Date, s.value)
    }
  }

  dateLessThan(s: DateLessThan): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isDate(value) && isBefore(value as Date, s.value)
    }
  }

  dateGreaterThanOrEqual(s: DateGreaterThanOrEqual): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isDate(value) && (isAfter(value as Date, s.value) || isEqual(value as Date, s.value))
    }
  }

  dateLessThanOrEqual(s: DateLessThanOrEqual): void {
    this.predicate = (r) => {
      const value = r.values[s.name]
      return isDate(value) && (isBefore(value as Date, s.value) || isEqual(value as Date, s.value))
    }
  }

  values(): void {
    throw new Error('[RecordInMemoryQueryVisitor.values] Method not implemented.')
  }
}

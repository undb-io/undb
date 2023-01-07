import type {
  BoolIsFalse,
  BoolIsTrue,
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateIsToday,
  DateLessThan,
  DateLessThanOrEqual,
  DateRangeEqual,
  IRecordVisitor,
  NullSpecification,
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
  SelectEqual,
  SelectIn,
  StringContain,
  StringEndsWith,
  StringEqual,
  StringRegex,
  StringStartsWith,
  WithRecordCreatedAt,
  WithRecordId,
  WithRecordTableId,
  WithRecordValues,
} from '@egodb/core'
import type { RecordInMemory } from './record.type'

export class RecordInMemoryMutationVisitor implements IRecordVisitor {
  constructor(private record: RecordInMemory) {}
  null(s: NullSpecification): void {
    throw new Error('Method not implemented.')
  }
  idEqual(s: WithRecordId): void {
    throw new Error('Method not implemented.')
  }
  tableIdEqual(s: WithRecordTableId): void {
    throw new Error('Method not implemented.')
  }
  createdAt(s: WithRecordCreatedAt): void {
    throw new Error('Method not implemented.')
  }
  values(s: WithRecordValues): void {
    this.record.values = { ...this.record.values, ...s.values.toObject() }
  }
  stringEqual(s: StringEqual): void {
    throw new Error('Method not implemented.')
  }
  stringContain(s: StringContain): void {
    throw new Error('Method not implemented.')
  }
  stringStartsWith(s: StringStartsWith): void {
    throw new Error('Method not implemented.')
  }
  stringEndsWith(s: StringEndsWith): void {
    throw new Error('Method not implemented.')
  }
  stringRegex(s: StringRegex): void {
    throw new Error('Method not implemented.')
  }
  numberEqual(s: NumberEqual): void {
    throw new Error('Method not implemented.')
  }
  numberGreaterThan(s: NumberGreaterThan): void {
    throw new Error('Method not implemented.')
  }
  numberLessThan(s: NumberLessThan): void {
    throw new Error('Method not implemented.')
  }
  numberGreaterThanOrEqual(s: NumberGreaterThanOrEqual): void {
    throw new Error('Method not implemented.')
  }
  numberLessThanOrEqual(s: NumberLessThanOrEqual): void {
    throw new Error('Method not implemented.')
  }
  dateEqual(s: DateEqual): void {
    throw new Error('Method not implemented.')
  }
  dateGreaterThan(s: DateGreaterThan): void {
    throw new Error('Method not implemented.')
  }
  dateLessThan(s: DateLessThan): void {
    throw new Error('Method not implemented.')
  }
  dateGreaterThanOrEqual(s: DateGreaterThanOrEqual): void {
    throw new Error('Method not implemented.')
  }
  dateLessThanOrEqual(s: DateLessThanOrEqual): void {
    throw new Error('Method not implemented.')
  }
  dateIsToday(s: DateIsToday): void {
    throw new Error('Method not implemented.')
  }
  dateRangeEqual(s: DateRangeEqual): void {
    throw new Error('Method not implemented.')
  }
  selectEqual(s: SelectEqual): void {
    throw new Error('Method not implemented.')
  }
  selectIn(s: SelectIn): void {
    throw new Error('Method not implemented.')
  }
  boolIsTrue(s: BoolIsTrue): void {
    throw new Error('Method not implemented.')
  }
  boolIsFalse(s: BoolIsFalse): void {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}

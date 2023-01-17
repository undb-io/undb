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
  WithRecordUpdatedAt,
  WithRecordValues,
} from '@egodb/core'
import { DateRangeFieldValue, ReferenceFieldValue } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import type { Primitive } from 'type-fest'

export class RecordSqliteMutationVisitor implements IRecordVisitor {
  constructor(private readonly qb: Knex.QueryBuilder) {}
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
  updatedAt(s: WithRecordUpdatedAt): void {
    throw new Error('Method not implemented.')
  }
  values(s: WithRecordValues): void {
    // TODO
    const data = [...s.values.value.entries()].reduce<Record<string, Primitive | Date | string[]>>(
      (prev, [fieldId, value]) => {
        if (value instanceof DateRangeFieldValue) {
          prev[fieldId + '_from'] = value.from.into()
          prev[fieldId + '_to'] = value.to.into()
        } else if (value instanceof ReferenceFieldValue) {
          prev[fieldId] = value.unpack() === null ? value.unpack() : JSON.stringify(value.unpack())
        } else {
          prev[fieldId] = value.unpack()
        }
        return prev
      },
      {} as Record<string, Primitive | Date | string>,
    )
    this.qb.update(data)
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

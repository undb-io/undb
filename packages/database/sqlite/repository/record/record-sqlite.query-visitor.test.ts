import {
  BoolIsFalse,
  BoolIsTrue,
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateIsToday,
  DateLessThan,
  DateLessThanOrEqual,
  DateRangeEqual,
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
  StringStartsWith,
  WithRecordCreatedAt,
  WithRecordId,
  WithRecordUpdatedAt,
} from '@egodb/core'
import { Knex } from '@mikro-orm/better-sqlite'
import { Entity, PrimaryKey } from '@mikro-orm/core'
import { addDays, subDays } from 'date-fns'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor'

@Entity()
class MockEntity {
  @PrimaryKey()
  id!: string
}

const date = new Date(2022, 2, 2)
describe('RecordSqliteQueryVisitor', () => {
  let knex: Knex
  let visitor: RecordSqliteQueryVisitor

  beforeAll(async () => {
    // @ts-expect-error type
    knex = global.knex
    vi.setSystemTime(date)
  })

  beforeEach(() => {
    visitor = new RecordSqliteQueryVisitor(knex.queryBuilder())
    expect(visitor).not.to.be.undefined
    expect(visitor).to.be.instanceof(RecordSqliteQueryVisitor)
  })

  test('should init knex', () => {
    expect(knex).not.to.be.undefined
  })

  test('idEqual', () => {
    visitor.idEqual(WithRecordId.fromString('id'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and `id` = \'id\'"')
  })

  test('createdAt', () => {
    visitor.createdAt(WithRecordCreatedAt.fromDate(date))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `created_at` = \\"2022-03-02T00:00:00.000Z\\""',
    )
  })

  test('updatedAt', () => {
    visitor.updatedAt(WithRecordUpdatedAt.fromDate(date))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `updated_at` = \\"2022-03-02T00:00:00.000Z\\""',
    )
  })

  test('stringEqual', () => {
    visitor.stringEqual(new StringEqual('fieldKey', 'value'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and `fieldKey` = \'value\'"')
    visitor.stringEqual(new StringEqual('fieldKey', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `fieldKey` = \'value\' and `fieldKey` is null"',
    )
  })

  test('stringContain', () => {
    visitor.stringContain(new StringContain('fieldKey', 'value'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and fieldKey like \'%`value`%\'"')
    visitor.stringContain(new StringContain('fieldKey', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and fieldKey like \'%`value`%\' and `fieldKey` is null"',
    )
  })

  test('stringStartsWith', () => {
    visitor.stringStartsWith(new StringStartsWith('fieldKey', 'value'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and fieldKey like \'`value`%\'"')

    visitor.stringStartsWith(new StringStartsWith('fieldKey', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and fieldKey like \'`value`%\' and `fieldKey` is null"',
    )
  })

  test('stringEndsWith', () => {
    visitor.stringEndsWith(new StringEndsWith('fieldKey', 'value'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and fieldKey like \'%`value`\'"')

    visitor.stringEndsWith(new StringEndsWith('fieldKey', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and fieldKey like \'%`value`\' and `fieldKey` is null"',
    )
  })

  test('numberEqual', () => {
    visitor.numberEqual(new NumberEqual('fieldKey', 1000))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and `fieldKey` = 1000"')
  })

  test('numberGreaterThan', () => {
    visitor.numberGreaterThan(new NumberGreaterThan('fieldKey', 1000))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and `fieldKey` > 1000"')
  })

  test('numberLessThan', () => {
    visitor.numberLessThan(new NumberLessThan('fieldKey', 1000))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and `fieldKey` < 1000"')
  })

  test('numberGreaterThanOrEqual', () => {
    visitor.numberGreaterThanOrEqual(new NumberGreaterThanOrEqual('fieldKey', 1000))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and `fieldKey` >= 1000"')
  })

  test('numberLessThanOrEqual', () => {
    visitor.numberLessThanOrEqual(new NumberLessThanOrEqual('fieldKey', 1000))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and `fieldKey` <= 1000"')
  })

  test('dateEqual', () => {
    visitor.dateEqual(new DateEqual('fieldKey', date))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `fieldKey` = \\"2022-03-02T00:00:00.000Z\\""',
    )

    visitor.dateEqual(new DateEqual('fieldKey', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `fieldKey` = \\"2022-03-02T00:00:00.000Z\\" and `fieldKey` is null"',
    )
  })

  test('dateGreaterThan', () => {
    visitor.dateGreaterThan(new DateGreaterThan('fieldKey', date))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `fieldKey` > \\"2022-03-02T00:00:00.000Z\\""',
    )

    visitor.dateGreaterThan(new DateGreaterThan('fieldKey', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `fieldKey` > \\"2022-03-02T00:00:00.000Z\\" and `fieldKey` is null"',
    )
  })

  test('dateGreaterThanOrEqual', () => {
    visitor.dateGreaterThanOrEqual(new DateGreaterThanOrEqual('fieldKey', date))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `fieldKey` >= \\"2022-03-02T00:00:00.000Z\\""',
    )

    visitor.dateGreaterThanOrEqual(new DateGreaterThanOrEqual('fieldKey', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `fieldKey` >= \\"2022-03-02T00:00:00.000Z\\" and `fieldKey` is null"',
    )
  })

  test('dateLessThan', () => {
    visitor.dateLessThan(new DateLessThan('fieldKey', date))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `fieldKey` < \\"2022-03-02T00:00:00.000Z\\""',
    )

    visitor.dateLessThan(new DateLessThan('fieldKey', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `fieldKey` < \\"2022-03-02T00:00:00.000Z\\" and `fieldKey` is null"',
    )
  })

  test('dateLessThanOrEqual', () => {
    visitor.dateLessThanOrEqual(new DateLessThanOrEqual('fieldKey', date))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `fieldKey` <= \\"2022-03-02T00:00:00.000Z\\""',
    )

    visitor.dateLessThanOrEqual(new DateLessThanOrEqual('fieldKey', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `fieldKey` <= \\"2022-03-02T00:00:00.000Z\\" and `fieldKey` is null"',
    )
  })

  test('dateIsToday', () => {
    visitor.dateIsToday(new DateIsToday('fieldKey'))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `fieldKey` between \\"2022-03-02T00:00:00.000Z\\" and \\"2022-03-02T23:59:59.999Z\\""',
    )
  })

  test('null', () => {
    visitor.null(new NullSpecification('fieldKey'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and `fieldKey` is null"')
  })

  test('dateRangeEqual', () => {
    visitor.dateRangeEqual(new DateRangeEqual('field', [subDays(new Date(), 1), addDays(new Date(), 1)]))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `field` between \\"2022-03-01T00:00:00.000Z\\" and \\"2022-03-03T00:00:00.000Z\\""',
    )

    visitor.dateRangeEqual(new DateRangeEqual('field', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `field` between \\"2022-03-01T00:00:00.000Z\\" and \\"2022-03-03T00:00:00.000Z\\" and `field` is null"',
    )
  })

  test('selectEqual', () => {
    visitor.selectEqual(new SelectEqual('fieldKey', 'opt1'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and `fieldKey` = \'opt1\'"')

    visitor.selectEqual(new SelectEqual('fieldKey', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `fieldKey` = \'opt1\' and `fieldKey` is null"',
    )
  })

  test('selectIn', () => {
    visitor.selectIn(new SelectIn('fieldKey', ['opt1, opt2']))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `deleted_at` is null and `fieldKey` in (\'opt1, opt2\')"',
    )
  })

  test('selectIn empty', () => {
    visitor.selectIn(new SelectIn('fieldKey', []))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and 1 = 0"')
  })

  test('boolIsTrue', () => {
    visitor.boolIsTrue(new BoolIsTrue('fieldKey'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and `fieldKey` = true"')
  })

  test('boolIsFalse', () => {
    visitor.boolIsFalse(new BoolIsFalse('fieldKey'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and `fieldKey` = false"')
  })

  test('string not equal', () => {
    const spec = new StringEqual('fieldKey', 'value').not()
    spec.accept(visitor)
    expect(visitor.query).toMatchInlineSnapshot('"select * where `deleted_at` is null and not `fieldKey` = \'value\'"')
  })
})

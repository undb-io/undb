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
import { BetterSqliteDriver, Knex, MikroORM } from '@mikro-orm/better-sqlite'
import { defineConfig, Entity, PrimaryKey } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
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
    const orm = await MikroORM.init(
      defineConfig({
        entities: [MockEntity],
        metadataProvider: TsMorphMetadataProvider,
        dbName: ':memory:',
        driver: BetterSqliteDriver,
      }),
    )

    knex = orm.em.getKnex()
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
    expect(visitor.query).toMatchInlineSnapshot('"select * where `id` = \'id\'"')
  })

  test('createdAt', () => {
    visitor.createdAt(WithRecordCreatedAt.fromDate(date))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `created_at` = \\"2022-03-02T00:00:00.000Z\\""')
  })

  test('updatedAt', () => {
    visitor.updatedAt(WithRecordUpdatedAt.fromDate(date))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `updated_at` = \\"2022-03-02T00:00:00.000Z\\""')
  })

  test('stringEqual', () => {
    visitor.stringEqual(new StringEqual('fieldId', 'value'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` = \'value\'"')
    visitor.stringEqual(new StringEqual('fieldId', null))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` = \'value\' and `fieldId` is null"')
  })

  test('stringContain', () => {
    visitor.stringContain(new StringContain('fieldId', 'value'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where fieldId like \'%`value`%\'"')
    visitor.stringContain(new StringContain('fieldId', null))
    expect(visitor.query).toMatchInlineSnapshot('"select * where fieldId like \'%`value`%\' and `fieldId` is null"')
  })

  test('stringStartsWith', () => {
    visitor.stringStartsWith(new StringStartsWith('fieldId', 'value'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where fieldId like \'`value`%\'"')

    visitor.stringStartsWith(new StringStartsWith('fieldId', null))
    expect(visitor.query).toMatchInlineSnapshot('"select * where fieldId like \'`value`%\' and `fieldId` is null"')
  })

  test('stringEndsWith', () => {
    visitor.stringEndsWith(new StringEndsWith('fieldId', 'value'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where fieldId like \'%`value`\'"')

    visitor.stringEndsWith(new StringEndsWith('fieldId', null))
    expect(visitor.query).toMatchInlineSnapshot('"select * where fieldId like \'%`value`\' and `fieldId` is null"')
  })

  test('numberEqual', () => {
    visitor.numberEqual(new NumberEqual('fieldId', 1000))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` = 1000"')
  })

  test('numberGreaterThan', () => {
    visitor.numberGreaterThan(new NumberGreaterThan('fieldId', 1000))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` > 1000"')
  })

  test('numberLessThan', () => {
    visitor.numberLessThan(new NumberLessThan('fieldId', 1000))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` < 1000"')
  })

  test('numberGreaterThanOrEqual', () => {
    visitor.numberGreaterThanOrEqual(new NumberGreaterThanOrEqual('fieldId', 1000))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` >= 1000"')
  })

  test('numberLessThanOrEqual', () => {
    visitor.numberLessThanOrEqual(new NumberLessThanOrEqual('fieldId', 1000))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` <= 1000"')
  })

  test('dateEqual', () => {
    visitor.dateEqual(new DateEqual('fieldId', date))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` = \\"2022-03-02T00:00:00.000Z\\""')

    visitor.dateEqual(new DateEqual('fieldId', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `fieldId` = \\"2022-03-02T00:00:00.000Z\\" and `fieldId` is null"',
    )
  })

  test('dateGreaterThan', () => {
    visitor.dateGreaterThan(new DateGreaterThan('fieldId', date))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` > \\"2022-03-02T00:00:00.000Z\\""')

    visitor.dateGreaterThan(new DateGreaterThan('fieldId', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `fieldId` > \\"2022-03-02T00:00:00.000Z\\" and `fieldId` is null"',
    )
  })

  test('dateGreaterThanOrEqual', () => {
    visitor.dateGreaterThanOrEqual(new DateGreaterThanOrEqual('fieldId', date))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` >= \\"2022-03-02T00:00:00.000Z\\""')

    visitor.dateGreaterThanOrEqual(new DateGreaterThanOrEqual('fieldId', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `fieldId` >= \\"2022-03-02T00:00:00.000Z\\" and `fieldId` is null"',
    )
  })

  test('dateLessThan', () => {
    visitor.dateLessThan(new DateLessThan('fieldId', date))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` < \\"2022-03-02T00:00:00.000Z\\""')

    visitor.dateLessThan(new DateLessThan('fieldId', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `fieldId` < \\"2022-03-02T00:00:00.000Z\\" and `fieldId` is null"',
    )
  })

  test('dateLessThanOrEqual', () => {
    visitor.dateLessThanOrEqual(new DateLessThanOrEqual('fieldId', date))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` <= \\"2022-03-02T00:00:00.000Z\\""')

    visitor.dateLessThanOrEqual(new DateLessThanOrEqual('fieldId', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `fieldId` <= \\"2022-03-02T00:00:00.000Z\\" and `fieldId` is null"',
    )
  })

  test('dateIsToday', () => {
    visitor.dateIsToday(new DateIsToday('fieldId'))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `fieldId` between \\"2022-03-02T00:00:00.000Z\\" and \\"2022-03-02T23:59:59.999Z\\""',
    )
  })

  test('null', () => {
    visitor.null(new NullSpecification('fieldId'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` is null"')
  })

  test('dateRangeEqual', () => {
    visitor.dateRangeEqual(new DateRangeEqual('field', [subDays(new Date(), 1), addDays(new Date(), 1)]))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `field` between \\"2022-03-01T00:00:00.000Z\\" and \\"2022-03-03T00:00:00.000Z\\""',
    )

    visitor.dateRangeEqual(new DateRangeEqual('field', null))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * where `field` between \\"2022-03-01T00:00:00.000Z\\" and \\"2022-03-03T00:00:00.000Z\\" and `field` is null"',
    )
  })

  test('selectEqual', () => {
    visitor.selectEqual(new SelectEqual('fieldId', 'opt1'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` = \'opt1\'"')

    visitor.selectEqual(new SelectEqual('fieldId', null))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` = \'opt1\' and `fieldId` is null"')
  })

  test('selectIn', () => {
    visitor.selectIn(new SelectIn('fieldId', ['opt1, opt2']))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` in (\'opt1, opt2\')"')
  })

  test('selectIn empty', () => {
    visitor.selectIn(new SelectIn('fieldId', []))
    expect(visitor.query).toMatchInlineSnapshot('"select * where 1 = 0"')
  })

  test('boolIsTrue', () => {
    visitor.boolIsTrue(new BoolIsTrue('fieldId'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` = true"')
  })

  test('boolIsFalse', () => {
    visitor.boolIsFalse(new BoolIsFalse('fieldId'))
    expect(visitor.query).toMatchInlineSnapshot('"select * where `fieldId` = false"')
  })

  test('string not equal', () => {
    const spec = new StringEqual('fieldId', 'value').not()
    spec.accept(visitor)
    expect(visitor.query).toMatchInlineSnapshot('"select * where not `fieldId` = \'value\'"')
  })
})

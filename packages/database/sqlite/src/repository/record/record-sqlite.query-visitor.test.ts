import { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import {
  BoolIsFalse,
  BoolIsTrue,
  DateEqual,
  DateFieldValue,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateIsToday,
  DateLessThan,
  DateLessThanOrEqual,
  DateRangeEqual,
  DateRangeFieldValue,
  IsTreeRoot,
  NumberEqual,
  NumberFieldValue,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
  SelectEqual,
  SelectFieldValue,
  SelectIn,
  StringContain,
  StringEndsWith,
  StringEqual,
  StringFieldValue,
  StringStartsWith,
  TreeAvailableSpec,
  TreeField,
  WithRecordCreatedAt,
  WithRecordId,
  WithRecordUpdatedAt,
} from '@undb/core'
import { addDays, subDays } from 'date-fns'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor.js'

const date = new Date(2022, 2, 2)
describe('RecordSqliteQueryVisitor', () => {
  let em: EntityManager
  let knex: Knex
  let visitor: RecordSqliteQueryVisitor

  beforeAll(async () => {
    // @ts-expect-error type
    em = global.em
    // @ts-expect-error type
    knex = global.knex
    vi.setSystemTime(date)
  })

  beforeEach(() => {
    visitor = new RecordSqliteQueryVisitor('tabletest', new Map(), em, knex.queryBuilder(), knex)
    expect(visitor).not.to.be.undefined
    expect(visitor).to.be.instanceof(RecordSqliteQueryVisitor)
  })

  test('should init knex', () => {
    expect(knex).not.to.be.undefined
  })

  test('idEqual', () => {
    visitor.idEqual(WithRecordId.fromString('id'))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`id` = \'id\'"',
    )
  })

  test('createdAt', () => {
    visitor.createdAt(WithRecordCreatedAt.fromDate(date))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`created_at` = \\"2022-03-02T00:00:00.000Z\\""',
    )
  })

  test('updatedAt', () => {
    visitor.updatedAt(WithRecordUpdatedAt.fromDate(date))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`updated_at` = \\"2022-03-02T00:00:00.000Z\\""',
    )
  })

  test('stringEqual', () => {
    visitor.stringEqual(new StringEqual('fieldId', new StringFieldValue('value')))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` = \'value\'"',
    )
    visitor.stringEqual(new StringEqual('fieldId', new StringFieldValue(null)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` = \'value\' and `t`.`fieldId` is null"',
    )
  })

  test('stringContain', () => {
    visitor.stringContain(new StringContain('fieldId', new StringFieldValue('value')))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` like \'%value%\'"',
    )
    visitor.stringContain(new StringContain('fieldId', new StringFieldValue(null)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` like \'%value%\' and `t`.`fieldId` is null"',
    )
  })

  test('stringStartsWith', () => {
    visitor.stringStartsWith(new StringStartsWith('fieldId', new StringFieldValue('value')))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` like \'value%\'"',
    )

    visitor.stringStartsWith(new StringStartsWith('fieldId', new StringFieldValue(null)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` like \'value%\' and `t`.`fieldId` is null"',
    )
  })

  test('stringEndsWith', () => {
    visitor.stringEndsWith(new StringEndsWith('fieldId', new StringFieldValue('value')))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` like \'%value\'"',
    )

    visitor.stringEndsWith(new StringEndsWith('fieldId', new StringFieldValue(null)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` like \'%value\' and `t`.`fieldId` is null"',
    )
  })

  test('numberEqual', () => {
    visitor.numberEqual(new NumberEqual('fieldId', new NumberFieldValue(1000)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` = 1000"',
    )
  })

  test('numberGreaterThan', () => {
    visitor.numberGreaterThan(new NumberGreaterThan('fieldId', new NumberFieldValue(1000)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` > 1000"',
    )
  })

  test('numberLessThan', () => {
    visitor.numberLessThan(new NumberLessThan('fieldId', new NumberFieldValue(1000)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` < 1000"',
    )
  })

  test('numberGreaterThanOrEqual', () => {
    visitor.numberGreaterThanOrEqual(new NumberGreaterThanOrEqual('fieldId', new NumberFieldValue(1000)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` >= 1000"',
    )
  })

  test('numberLessThanOrEqual', () => {
    visitor.numberLessThanOrEqual(new NumberLessThanOrEqual('fieldId', new NumberFieldValue(1000)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` <= 1000"',
    )
  })

  test('dateEqual', () => {
    visitor.dateEqual(new DateEqual('fieldId', new DateFieldValue(date)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` = \'2022-03-02T00:00:00.000Z\'"',
    )

    visitor.dateEqual(new DateEqual('fieldId', new DateFieldValue(null)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` = \'2022-03-02T00:00:00.000Z\' and `t`.`fieldId` is null"',
    )
  })

  test('dateGreaterThan', () => {
    visitor.dateGreaterThan(new DateGreaterThan('fieldId', new DateFieldValue(date)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` > \'2022-03-02T00:00:00.000Z\'"',
    )

    visitor.dateGreaterThan(new DateGreaterThan('fieldId', new DateFieldValue(null)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` > \'2022-03-02T00:00:00.000Z\' and `t`.`fieldId` is null"',
    )
  })

  test('dateGreaterThanOrEqual', () => {
    visitor.dateGreaterThanOrEqual(new DateGreaterThanOrEqual('fieldId', new DateFieldValue(date)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` >= \'2022-03-02T00:00:00.000Z\'"',
    )

    visitor.dateGreaterThanOrEqual(new DateGreaterThanOrEqual('fieldId', new DateFieldValue(null)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` >= \'2022-03-02T00:00:00.000Z\' and `t`.`fieldId` is null"',
    )
  })

  test('dateLessThan', () => {
    visitor.dateLessThan(new DateLessThan('fieldId', new DateFieldValue(date)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` < \'2022-03-02T00:00:00.000Z\'"',
    )

    visitor.dateLessThan(new DateLessThan('fieldId', new DateFieldValue(null)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` < \'2022-03-02T00:00:00.000Z\' and `t`.`fieldId` is null"',
    )
  })

  test('dateLessThanOrEqual', () => {
    visitor.dateLessThanOrEqual(new DateLessThanOrEqual('fieldId', new DateFieldValue(date)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` <= \'2022-03-02T00:00:00.000Z\'"',
    )

    visitor.dateLessThanOrEqual(new DateLessThanOrEqual('fieldId', new DateFieldValue(null)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` <= \'2022-03-02T00:00:00.000Z\' and `t`.`fieldId` is null"',
    )
  })

  test('dateIsToday', () => {
    visitor.dateIsToday(new DateIsToday('fieldId'))
    expect(visitor.query).toMatchInlineSnapshot(
      "\"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` between '2022-03-02T00:00:00.000Z' and '2022-03-02T23:59:59.999Z'\"",
    )
  })

  test('dateRangeEqual', () => {
    visitor.dateRangeEqual(
      new DateRangeEqual('field', new DateRangeFieldValue([subDays(new Date(), 1), addDays(new Date(), 1)])),
    )
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`field` between \\"2022-03-01T00:00:00.000Z\\" and \\"2022-03-03T00:00:00.000Z\\""',
    )

    visitor.dateRangeEqual(new DateRangeEqual('field', new DateRangeFieldValue(null)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`field` between \\"2022-03-01T00:00:00.000Z\\" and \\"2022-03-03T00:00:00.000Z\\" and `t`.`field` is null"',
    )
  })

  test('selectEqual', () => {
    visitor.selectEqual(new SelectEqual('fieldId', new SelectFieldValue('opt1')))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` = \'opt1\'"',
    )

    visitor.selectEqual(new SelectEqual('fieldId', new SelectFieldValue(null)))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` = \'opt1\' and `t`.`fieldId` is null"',
    )
  })

  test('selectIn', () => {
    visitor.selectIn(
      new SelectIn(
        'fieldId',
        ['opt1, opt2'].map((o) => new SelectFieldValue(o)),
      ),
    )
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `fieldId` in (\'opt1, opt2\')"',
    )
  })

  test('selectIn empty', () => {
    visitor.selectIn(new SelectIn('fieldId', []))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and 1 = 0"',
    )
  })

  test('boolIsTrue', () => {
    visitor.boolIsTrue(new BoolIsTrue('fieldId'))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` = true"',
    )
  })

  test('boolIsFalse', () => {
    visitor.boolIsFalse(new BoolIsFalse('fieldId'))
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`fieldId` = false"',
    )
  })

  test('string not equal', () => {
    const spec = new StringEqual('fieldId', new StringFieldValue('value')).not()
    spec.accept(visitor)
    expect(visitor.query).toMatchInlineSnapshot(
      '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and not `t`.`fieldId` = \'value\'"',
    )
  })

  describe('tree', () => {
    const treeFieldId = 'treefieldid'
    beforeEach(() => {
      visitor = new RecordSqliteQueryVisitor(
        'tabletest',
        new Map([[treeFieldId, TreeField.create({ id: treeFieldId, name: 'tree' })]]),
        em,
        knex.queryBuilder(),
        knex,
      )
    })

    describe('treeAvailable', () => {
      test('with record id', () => {
        visitor.treeAvailable(new TreeAvailableSpec(treeFieldId, 'recordId'))
        expect(visitor.query).toMatchInlineSnapshot(
          "\"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`id` not in (select distinct `child_id` from `treefieldid_tabletest_closure_table` where `depth` > 0 union select distinct `parent_id` from `treefieldid_tabletest_closure_table` where `child_id` = 'recordId' and not `parent_id` = 'recordId') and not `t`.`id` = 'recordId'\"",
        )
      })

      test('without record id', () => {
        visitor.treeAvailable(new TreeAvailableSpec(treeFieldId, undefined))
        expect(visitor.query).toMatchInlineSnapshot(
          '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`id` not in (select distinct `child_id` from `treefieldid_tabletest_closure_table` where `depth` > 0)"',
        )
      })
    })

    test('isTreeRoot', () => {
      visitor.isTreeRoot(new IsTreeRoot(treeFieldId, undefined))

      expect(visitor.query).toMatchInlineSnapshot(
        '"select * from `tabletest` as `t` where `t`.`deleted_at` is null and `t`.`id` not in (select `child_id` from `treefieldid_tabletest_closure_table` where `depth` > \'0\')"',
      )
    })
  })
})

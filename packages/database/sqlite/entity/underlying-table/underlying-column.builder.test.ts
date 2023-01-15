import { BoolField, DateField, DateRangeField, NumberField, SelectField, StringField } from '@egodb/core'
import { Knex } from '@mikro-orm/better-sqlite'
import { UnderlyingColumnBuilder } from './underlying-column.builder'

describe('UnderlyingColumnBuilder', () => {
  const tableName = 'tableName'
  let knex: Knex
  beforeAll(() => {
    // @ts-expect-error
    knex = global.knex
  })

  test('should create id column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingColumnBuilder(knex, tb)
      builder.createId()
    })

    expect(sb.toQuery()).toMatchInlineSnapshot(
      '"create table `tableName` (`id` varchar(255) not null, primary key (`id`))"',
    )
  })

  test('should create created_at column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingColumnBuilder(knex, tb)
      builder.createCreatedAt()
    })

    expect(sb.toQuery()).toMatchInlineSnapshot(
      '"create table `tableName` (`created_at` datetime not null default CURRENT_TIMESTAMP)"',
    )
  })

  test('should create updated_at column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingColumnBuilder(knex, tb)
      builder.createUpdatedAt(tableName)
    })

    expect(sb.toQuery()).toMatchInlineSnapshot(
      '"create table `tableName` (`updated_at` datetime not null default CURRENT_TIMESTAMP)"',
    )
  })

  test('should create string column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingColumnBuilder(knex, tb)
      builder.createUnderlying([
        StringField.create({ id: 'fldid', name: 'name', key: 'undelying table', type: 'string' }),
      ])
    })

    expect(sb.toQuery()).toMatchInlineSnapshot('"create table `tableName` (`fldid` varchar(255))"')
  })

  test('should create number column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingColumnBuilder(knex, tb)
      builder.createUnderlying([
        NumberField.create({ id: 'fldid', name: 'name', key: 'undelying table', type: 'number' }),
      ])
    })

    expect(sb.toQuery()).toMatchInlineSnapshot('"create table `tableName` (`fldid` float)"')
  })

  test('should create bool column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingColumnBuilder(knex, tb)
      builder.createUnderlying([BoolField.create({ id: 'fldid', name: 'name', key: 'undelying table', type: 'bool' })])
    })

    expect(sb.toQuery()).toMatchInlineSnapshot('"create table `tableName` (`fldid` boolean)"')
  })

  test('should create date column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingColumnBuilder(knex, tb)
      builder.createUnderlying([DateField.create({ id: 'fldid', name: 'name', key: 'undelying table', type: 'date' })])
    })

    expect(sb.toQuery()).toMatchInlineSnapshot('"create table `tableName` (`fldid` datetime)"')
  })

  test('should create date range column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingColumnBuilder(knex, tb)
      builder.createUnderlying([
        DateRangeField.create({ id: 'fldid', name: 'name', key: 'undelying table', type: 'date-range' }),
      ])
    })

    expect(sb.toQuery()).toMatchInlineSnapshot(
      '"create table `tableName` (`fldid_from` datetime, `fldid_to` datetime)"',
    )
  })

  test('should create select column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingColumnBuilder(knex, tb)
      builder.createUnderlying([
        SelectField.create({ id: 'fldid', name: 'name', key: 'undelying table', type: 'select', options: [] }),
      ])
    })

    expect(sb.toQuery()).toMatchInlineSnapshot('"create table `tableName` (`fldid` varchar(255))"')
  })
})

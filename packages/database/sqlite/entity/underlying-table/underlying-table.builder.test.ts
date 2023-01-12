import { BoolField, DateField, DateRangeField, NumberField, SelectField, StringField } from '@egodb/core'
import { Knex } from '@mikro-orm/better-sqlite'
import { UnderlyingTableBuilder } from './underlying-table.builder'

describe('UnderlyingTableBuilder', () => {
  const tableName = 'tableName'
  let knex: Knex
  beforeAll(() => {
    // @ts-expect-error
    knex = global.knex
  })

  test('should create id column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingTableBuilder(knex, tb, 'tableName')
      builder.createId()
    })

    expect(sb.toQuery()).toMatchInlineSnapshot(
      '"create table `tableName` (`id` varchar(255) not null, primary key (`id`))"',
    )
  })

  test('should create created_at column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingTableBuilder(knex, tb, 'tableName')
      builder.createCreatedAt()
    })

    expect(sb.toQuery()).toMatchInlineSnapshot(
      '"create table `tableName` (`created_at` datetime not null default CURRENT_TIMESTAMP)"',
    )
  })

  test('should create updated_at column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingTableBuilder(knex, tb, 'tableName')
      builder.createUpdatedAt()
    })

    expect(sb.toQuery()).toMatchInlineSnapshot(
      '"create table `tableName` (`updated_at` datetime not null default CURRENT_TIMESTAMP)"',
    )
  })

  test('should create string column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingTableBuilder(knex, tb, 'tableName')
      builder.createUnderlying([StringField.create({ name: 'name', id: 'undelying table', type: 'string' })])
    })

    expect(sb.toQuery()).toMatchInlineSnapshot('"create table `tableName` (`undelying table` varchar(255))"')
  })

  test('should create number column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingTableBuilder(knex, tb, 'tableName')
      builder.createUnderlying([NumberField.create({ name: 'name', id: 'undelying table', type: 'number' })])
    })

    expect(sb.toQuery()).toMatchInlineSnapshot('"create table `tableName` (`undelying table` float)"')
  })

  test('should create bool column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingTableBuilder(knex, tb, 'tableName')
      builder.createUnderlying([BoolField.create({ name: 'name', id: 'undelying table', type: 'bool' })])
    })

    expect(sb.toQuery()).toMatchInlineSnapshot('"create table `tableName` (`undelying table` boolean)"')
  })

  test('should create date column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingTableBuilder(knex, tb, 'tableName')
      builder.createUnderlying([DateField.create({ name: 'name', id: 'undelying table', type: 'date' })])
    })

    expect(sb.toQuery()).toMatchInlineSnapshot('"create table `tableName` (`undelying table` datetime)"')
  })

  test('should create date range column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingTableBuilder(knex, tb, 'tableName')
      builder.createUnderlying([DateRangeField.create({ name: 'name', id: 'undelying table', type: 'date-range' })])
    })

    expect(sb.toQuery()).toMatchInlineSnapshot(
      '"create table `tableName` (`undelying table_from` datetime, `undelying table_to` datetime)"',
    )
  })

  test('should create select column', () => {
    const sb = knex.schema
    sb.createTable(tableName, (tb) => {
      const builder = new UnderlyingTableBuilder(knex, tb, 'tableName')
      builder.createUnderlying([
        SelectField.create({ name: 'name', id: 'undelying table', type: 'select', options: [] }),
      ])
    })

    expect(sb.toQuery()).toMatchInlineSnapshot('"create table `tableName` (`undelying table` varchar(255))"')
  })
})

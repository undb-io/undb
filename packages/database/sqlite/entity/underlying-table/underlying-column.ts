import type { BoolField, DateField, DateRangeField, Field, NumberField, SelectField, StringField } from '@egodb/core'
import { INTERNAL_COLUMN_CREATED_AT_NAME, INTERNAL_COLUMN_ID_NAME, INTERNAL_COLUMN_UPDATED_AT_NAME } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import type { IUnderlyingColumn } from '../../types/underlying-column'
import { INTERNAL_COLUMN_DELETED_AT_NAME } from './constants'

export abstract class UnderlyingColumn implements IUnderlyingColumn {
  abstract get name(): string
  abstract build(tb: Knex.TableBuilder, knex: Knex, tableName: string): Knex.ColumnBuilder
}

export class UnderlyingIdColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_ID_NAME
  }

  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.string(this.name).notNullable().primary()
  }
}

export class UnderlyingCreatedAtColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_CREATED_AT_NAME
  }

  build(tb: Knex.TableBuilder, knex: Knex): Knex.ColumnBuilder {
    return tb.datetime(this.name).notNullable().defaultTo(knex.fn.now())
  }
}

export class UnderlyingUpdatedAtColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_UPDATED_AT_NAME
  }

  build(tb: Knex.TableBuilder, knex: Knex): Knex.ColumnBuilder {
    return tb.datetime(this.name).notNullable().defaultTo(knex.fn.now())
  }
}

export class UnderlyingDeletedAtColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_DELETED_AT_NAME
  }

  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.datetime(this.name).nullable()
  }
}

abstract class UnderlyingFieldColumn<F extends Field> implements IUnderlyingColumn {
  constructor(protected readonly field: F) {}
  get name(): string {
    return this.field.key.value
  }
  abstract build(tb: Knex.TableBuilder, knex: Knex, tableName: string): Knex.ColumnBuilder
}

export class UnderlyingStringColumn extends UnderlyingFieldColumn<StringField> {
  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.string(this.name)
  }
}

export class UnderlyingNumberColumn extends UnderlyingFieldColumn<NumberField> {
  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.float(this.name)
  }
}

export class UnderlyingBoolColumn extends UnderlyingFieldColumn<BoolField> {
  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.boolean(this.name)
  }
}

export class UnderlyingDateColumn extends UnderlyingFieldColumn<DateField> {
  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.dateTime(this.name)
  }
}

export class UnderlyingDateRangeFromColumn extends UnderlyingFieldColumn<DateRangeField> {
  get name(): string {
    return super.name + '_from'
  }

  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.dateTime(this.name)
  }
}

export class UnderlyingDateRangeToFromColumn extends UnderlyingFieldColumn<DateRangeField> {
  get name(): string {
    return super.name + '_to'
  }

  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.dateTime(this.name)
  }
}

export class UnderlyingSelectFromColumn extends UnderlyingFieldColumn<SelectField> {
  build(tb: Knex.TableBuilder): Knex.ColumnBuilder {
    return tb.string(this.name)
  }
}

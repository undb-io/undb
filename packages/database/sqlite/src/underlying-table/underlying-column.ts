/* eslint-disable @typescript-eslint/no-empty-function */
import type { Knex } from '@mikro-orm/better-sqlite'
import type {
  AttachmentField,
  AverageField,
  BoolField,
  CollaboratorField,
  ColorField,
  CountField,
  DateField,
  DateRangeField,
  EmailField,
  Field,
  LookupField,
  NumberField,
  ParentField,
  RatingField,
  ReferenceField,
  SelectField,
  StringField,
  SumField,
  TreeField,
} from '@undb/core'
import {
  INTERNAL_INCREAMENT_ID_NAME as INTERNAL_AUTO_INCREAMENT_ID_NAME,
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_CREATED_BY_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  INTERNAL_COLUMN_UPDATED_BY_NAME,
} from '@undb/core'
import type { Promisable } from 'type-fest'
import type { IUnderlyingColumn } from '../interfaces/underlying-column.js'
import { INTERNAL_COLUMN_DELETED_AT_NAME, INTERNAL_COLUMN_DELETED_BY_NAME } from './constants.js'

export abstract class UnderlyingColumn implements IUnderlyingColumn {
  constructor(public readonly field: Field | undefined, protected readonly tableName: string) {}

  public readonly queries: string[] = []
  get system(): boolean {
    return true
  }

  get virtual(): boolean {
    return false
  }
  abstract get name(): string
  abstract build(tb: Knex.TableBuilder, knex: Knex, isNewTable?: boolean): Promisable<void>
}

export class UnderlyingIdColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_ID_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.string(this.name).notNullable()
  }
}

export class UnderlyingAutoIncreamentColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_AUTO_INCREAMENT_ID_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.increments(this.name).notNullable()
  }
}

export class UnderlyingCreatedAtColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_CREATED_AT_NAME
  }

  build(tb: Knex.TableBuilder, knex: Knex): void {
    tb.datetime(this.name).notNullable().defaultTo(knex.fn.now())
  }
}

export class UnderlyingCreatedByColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_CREATED_BY_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.string(this.name).notNullable()
  }
}

export class UnderlyingUpdatedByColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_UPDATED_BY_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.string(this.name).notNullable()
  }
}

export class UnderlyingUpdatedAtColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_UPDATED_AT_NAME
  }

  build(tb: Knex.TableBuilder, knex: Knex): void {
    tb.datetime(this.name).notNullable().defaultTo(knex.fn.now())
  }
}

export class UnderlyingDeletedAtColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_DELETED_AT_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.datetime(this.name).nullable()
  }
}

export class UnderlyingDeletedByColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_DELETED_BY_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.string(this.name)
  }
}

abstract class UnderlyingFieldColumn<F extends Field> implements IUnderlyingColumn {
  constructor(public readonly field: F, protected readonly tableName: string) {}
  public readonly queries: string[] = []
  get system(): boolean {
    return false
  }
  get name(): string {
    return this.field.id.value
  }
  get virtual(): boolean {
    return false
  }
  abstract build(tb: Knex.TableBuilder, knex: Knex, isNewTable?: boolean): Promisable<void>
}

abstract class UnderlyingVirtualColumn<F extends Field> extends UnderlyingFieldColumn<F> {
  override get virtual() {
    return true
  }

  build(): Promisable<void> {}
}

export class UnderlyingStringColumn extends UnderlyingFieldColumn<StringField> {
  build(tb: Knex.TableBuilder): void {
    tb.string(this.name)
  }
}

export class UnderlyingEmailColumn extends UnderlyingFieldColumn<EmailField> {
  build(tb: Knex.TableBuilder): void {
    tb.string(this.name)
  }
}

export class UnderlyingAttachmentColumn extends UnderlyingFieldColumn<AttachmentField> {
  override get virtual() {
    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  build(tb: Knex.TableBuilder): void {}
}

export class UnderlyingColorColumn extends UnderlyingFieldColumn<ColorField> {
  build(tb: Knex.TableBuilder): void {
    tb.string(this.name, 10)
  }
}

export class UnderlyingNumberColumn extends UnderlyingFieldColumn<NumberField> {
  build(tb: Knex.TableBuilder): void {
    tb.float(this.name)
  }
}

export class UnderlyingRatingColumn extends UnderlyingFieldColumn<RatingField> {
  build(tb: Knex.TableBuilder): void {
    tb.float(this.name)
  }
}

export class UnderlyingBoolColumn extends UnderlyingFieldColumn<BoolField> {
  build(tb: Knex.TableBuilder): void {
    tb.boolean(this.name)
  }
}

export class UnderlyingDateColumn extends UnderlyingFieldColumn<DateField> {
  build(tb: Knex.TableBuilder): void {
    tb.dateTime(this.name)
  }
}

const UNDERLYING_DATE_RANGE_FROM = '_from'

export type UnderlyingDateRangeFromColumnName = `${string}${typeof UNDERLYING_DATE_RANGE_FROM}`

export const isUnlderlyingDateTangeFromColumn = (str: string): str is UnderlyingDateRangeFromColumnName =>
  str.endsWith(UNDERLYING_DATE_RANGE_FROM)

export const getFieldIdFromDateRangeFromColumnName = (name: UnderlyingDateRangeFromColumnName): string =>
  name.replace(UNDERLYING_DATE_RANGE_FROM, '')

export class UnderlyingDateRangeFromColumn extends UnderlyingFieldColumn<DateRangeField> {
  get name(): UnderlyingDateRangeFromColumnName {
    return `${super.name}${UNDERLYING_DATE_RANGE_FROM}`
  }

  build(tb: Knex.TableBuilder): void {
    tb.dateTime(this.name)
  }
}

const UNDERLYING_DATE_RANGE_TO = '_to'

export type UnderlyingDateRangeToColumnName = `${string}${typeof UNDERLYING_DATE_RANGE_TO}`

export const isUnlderlyingDateTangeToColumn = (str: string): str is UnderlyingDateRangeToColumnName =>
  str.endsWith(UNDERLYING_DATE_RANGE_TO)

export const getFieldIdFromDateRangeToColumnName = (name: UnderlyingDateRangeToColumnName): string =>
  name.replace(UNDERLYING_DATE_RANGE_TO, '')

export class UnderlyingDateRangeToFromColumn extends UnderlyingFieldColumn<DateRangeField> {
  get name(): UnderlyingDateRangeToColumnName {
    return `${super.name}${UNDERLYING_DATE_RANGE_TO}`
  }

  build(tb: Knex.TableBuilder): void {
    tb.dateTime(this.name)
  }
}

export class UnderlyingSelectColumn extends UnderlyingFieldColumn<SelectField> {
  build(tb: Knex.TableBuilder): void {
    tb.string(this.name)
  }
}

export class UnderlyingCollaboratorColumn extends UnderlyingVirtualColumn<CollaboratorField> {}

export class UnderlyingReferenceColumn extends UnderlyingVirtualColumn<ReferenceField> {}

export class UnderlyingTreeColumn extends UnderlyingVirtualColumn<TreeField> {}

export class UnderlyingParentColumn extends UnderlyingVirtualColumn<ParentField> {}

export class UnderlyingCountColumn extends UnderlyingVirtualColumn<CountField> {}

export class UnderlyingSumColumn extends UnderlyingVirtualColumn<SumField> {}

export class UnderlyingAverageColumn extends UnderlyingVirtualColumn<AverageField> {}

export class UnderlyingLookupColumn extends UnderlyingVirtualColumn<LookupField> {}

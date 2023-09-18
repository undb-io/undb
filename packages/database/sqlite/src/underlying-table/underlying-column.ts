/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import type { Knex } from '@mikro-orm/better-sqlite'
import {
  INTERNAL_INCREMENT_ID_NAME as INTERNAL_AUTO_INCREMENT_ID_NAME,
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
  constructor(
    public readonly fieldId: string | undefined,
    protected readonly tableName: string,
  ) {}

  public readonly queries: string[] = []
  get system(): boolean {
    return true
  }

  get virtual(): boolean {
    return false
  }
  get tempName(): string {
    return getTempColumnName(this.name)
  }
  abstract get name(): string
  abstract build(tb: Knex.TableBuilder, knex: Knex, isNewTable?: boolean): Promisable<void>
  abstract buildTemp(tb: Knex.TableBuilder): void
}

export class UnderlyingIdColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_ID_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.string(this.name).notNullable()
  }
  buildTemp(tb: Knex.TableBuilder): void {}
}

export class UnderlyingAutoIncrementColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_AUTO_INCREMENT_ID_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.increments(this.name).notNullable()
  }
  buildTemp(tb: Knex.TableBuilder): void {}
}

export class UnderlyingCreatedAtColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_CREATED_AT_NAME
  }

  build(tb: Knex.TableBuilder, knex: Knex): void {
    tb.datetime(this.name).notNullable().defaultTo(knex.fn.now())
  }
  buildTemp(tb: Knex.TableBuilder): void {}
}

export class UnderlyingCreatedByColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_CREATED_BY_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.string(this.name).notNullable()
  }
  buildTemp(tb: Knex.TableBuilder): void {}
}

export class UnderlyingUpdatedByColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_UPDATED_BY_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.string(this.name).notNullable()
  }
  buildTemp(tb: Knex.TableBuilder): void {}
}

export class UnderlyingUpdatedAtColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_UPDATED_AT_NAME
  }

  build(tb: Knex.TableBuilder, knex: Knex): void {
    tb.datetime(this.name).notNullable().defaultTo(knex.fn.now())
  }

  buildTemp(tb: Knex.TableBuilder): void {}
}

export class UnderlyingDeletedAtColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_DELETED_AT_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.datetime(this.name).nullable()
  }
  buildTemp(tb: Knex.TableBuilder): void {}
}

export class UnderlyingDeletedByColumn extends UnderlyingColumn {
  get name(): string {
    return INTERNAL_COLUMN_DELETED_BY_NAME
  }

  build(tb: Knex.TableBuilder): void {
    tb.string(this.name)
  }
  buildTemp(tb: Knex.TableBuilder): void {}
}

abstract class UnderlyingFieldColumn implements IUnderlyingColumn {
  constructor(
    public readonly fieldId: string,
    protected readonly tableName: string,
  ) {}
  public readonly queries: string[] = []
  get system(): boolean {
    return false
  }
  get name(): string {
    return this.fieldId
  }
  get tempName(): string {
    return getTempColumnName(this.name)
  }
  get virtual(): boolean {
    return false
  }
  abstract build(tb: Knex.TableBuilder, knex: Knex, isNewTable?: boolean): Promisable<void>
  abstract buildTemp(tb: Knex.TableBuilder): void
}

abstract class UnderlyingVirtualColumn extends UnderlyingFieldColumn {
  override get virtual() {
    return true
  }

  build(): Promisable<void> {}
  buildTemp(tb: Knex.TableBuilder): void {}
}

export class UnderlyingStringColumn extends UnderlyingFieldColumn {
  build(tb: Knex.TableBuilder): void {
    tb.string(this.name)
  }
  buildTemp(tb: Knex.TableBuilder): void {
    tb.string(this.tempName)
  }
}

export class UnderlyingEmailColumn extends UnderlyingFieldColumn {
  build(tb: Knex.TableBuilder): void {
    tb.string(this.name)
  }
  buildTemp(tb: Knex.TableBuilder): void {
    tb.string(this.tempName)
  }
}
export class UnderlyingUrlColumn extends UnderlyingFieldColumn {
  build(tb: Knex.TableBuilder): void {
    tb.string(this.name)
  }
  buildTemp(tb: Knex.TableBuilder): void {
    tb.string(this.tempName)
  }
}

export class UnderlyingJsonColumn extends UnderlyingFieldColumn {
  build(tb: Knex.TableBuilder): void {
    tb.json(this.name)
  }
  buildTemp(tb: Knex.TableBuilder): void {
    tb.json(this.tempName)
  }
}

export class UnderlyingAttachmentColumn extends UnderlyingFieldColumn {
  override get virtual() {
    return true
  }

  build(tb: Knex.TableBuilder): void {}
  buildTemp(tb: Knex.TableBuilder): void {}
}

export class UnderlyingColorColumn extends UnderlyingFieldColumn {
  build(tb: Knex.TableBuilder): void {
    tb.string(this.name, 10)
  }
  buildTemp(tb: Knex.TableBuilder): void {
    tb.string(this.tempName, 10)
  }
}

export class UnderlyingNumberColumn extends UnderlyingFieldColumn {
  build(tb: Knex.TableBuilder): void {
    tb.float(this.name)
  }
  buildTemp(tb: Knex.TableBuilder): void {
    tb.float(this.tempName)
  }
}

export class UnderlyingRatingColumn extends UnderlyingFieldColumn {
  build(tb: Knex.TableBuilder): void {
    tb.float(this.name)
  }
  buildTemp(tb: Knex.TableBuilder): void {
    tb.float(this.tempName)
  }
}

export class UnderlyingCurrencyColumn extends UnderlyingFieldColumn {
  build(tb: Knex.TableBuilder): void {
    tb.double(this.name)
  }
  buildTemp(tb: Knex.TableBuilder): void {
    tb.double(this.tempName)
  }
}

export class UnderlyingBoolColumn extends UnderlyingFieldColumn {
  build(tb: Knex.TableBuilder): void {
    tb.boolean(this.name).defaultTo(false)
  }
  buildTemp(tb: Knex.TableBuilder): void {
    tb.boolean(this.tempName).defaultTo(false)
  }
}

export class UnderlyingDateColumn extends UnderlyingFieldColumn {
  build(tb: Knex.TableBuilder): void {
    tb.dateTime(this.name)
  }
  buildTemp(tb: Knex.TableBuilder): void {
    tb.dateTime(this.tempName)
  }
}

const UNDERLYING_DATE_RANGE_FROM = '_from'

export type UnderlyingDateRangeFromColumnName = `${string}${typeof UNDERLYING_DATE_RANGE_FROM}`

export const isUnlderlyingDateTangeFromColumn = (str: string): str is UnderlyingDateRangeFromColumnName =>
  str.endsWith(UNDERLYING_DATE_RANGE_FROM)

export const getFieldIdFromDateRangeFromColumnName = (name: UnderlyingDateRangeFromColumnName): string =>
  name.replace(UNDERLYING_DATE_RANGE_FROM, '')

export class UnderlyingDateRangeFromColumn extends UnderlyingFieldColumn {
  get name(): UnderlyingDateRangeFromColumnName {
    return `${super.name}${UNDERLYING_DATE_RANGE_FROM}`
  }

  build(tb: Knex.TableBuilder): void {
    tb.dateTime(this.name)
  }

  buildTemp(tb: Knex.TableBuilder): void {
    tb.dateTime(this.tempName)
  }
}

const UNDERLYING_DATE_RANGE_TO = '_to'

export type UnderlyingDateRangeToColumnName = `${string}${typeof UNDERLYING_DATE_RANGE_TO}`

export const isUnlderlyingDateTangeToColumn = (str: string): str is UnderlyingDateRangeToColumnName =>
  str.endsWith(UNDERLYING_DATE_RANGE_TO)

export const getFieldIdFromDateRangeToColumnName = (name: UnderlyingDateRangeToColumnName): string =>
  name.replace(UNDERLYING_DATE_RANGE_TO, '')

export class UnderlyingDateRangeToColumn extends UnderlyingFieldColumn {
  get name(): UnderlyingDateRangeToColumnName {
    return `${super.name}${UNDERLYING_DATE_RANGE_TO}`
  }

  build(tb: Knex.TableBuilder): void {
    tb.dateTime(this.name)
  }
  buildTemp(tb: Knex.TableBuilder): void {
    tb.dateTime(this.tempName)
  }
}

export class UnderlyingSelectColumn extends UnderlyingFieldColumn {
  build(tb: Knex.TableBuilder): void {
    tb.string(this.name)
  }
  buildTemp(tb: Knex.TableBuilder): void {
    tb.string(this.tempName)
  }
}

export class UnderlyingMultiSelectColumn extends UnderlyingFieldColumn {
  build(tb: Knex.TableBuilder): void {
    tb.json(this.name)
  }
  buildTemp(tb: Knex.TableBuilder): void {
    tb.json(this.tempName)
  }
}

export class UnderlyingCollaboratorColumn extends UnderlyingVirtualColumn {}

export class UnderlyingQRCodeColumn extends UnderlyingVirtualColumn {}

export class UnderlyingReferenceColumn extends UnderlyingVirtualColumn {}

export class UnderlyingTreeColumn extends UnderlyingVirtualColumn {}

export class UnderlyingParentColumn extends UnderlyingVirtualColumn {}

export class UnderlyingCountColumn extends UnderlyingVirtualColumn {}

export class UnderlyingSumColumn extends UnderlyingVirtualColumn {}

export class UnderlyingAverageColumn extends UnderlyingVirtualColumn {}

export class UnderlyingLookupColumn extends UnderlyingVirtualColumn {}

export class UnderlyingMinColumn extends UnderlyingVirtualColumn {}

export class UnderlyingMaxColumn extends UnderlyingVirtualColumn {}

export const getTempColumnName = (name: string) => '__temp_' + name

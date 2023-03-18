import { isEmpty, unzip } from 'lodash-es'
import fp from 'lodash/fp.js'
import { z } from 'zod'
import type { ILookupFilter } from '../filter/lookup.filter.js'
import type { ILookupFilterOperator } from '../filter/operators.js'
import type { IRecordDisplayValues } from '../record/record.type.js'
import { BaseLookupField } from './field.base.js'
import type { ILookupField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { LookupFieldValue } from './lookup-field-value.js'
import type { ICreateLookupFieldInput, ICreateLookupFieldValue, LookupType } from './lookup-field.type.js'
import { DisplayFields } from './value-objects/display-fields.vo.js'
import { FieldId } from './value-objects/field-id.vo.js'

const { map, pipe } = fp

export class LookupField extends BaseLookupField<ILookupField> {
  type: LookupType = 'lookup'

  get multiple() {
    return true
  }

  override get primitive() {
    return false
  }

  get displayFieldIds(): FieldId[] {
    return this.props.displayFields?.ids ?? []
  }

  set displayFieldIds(ids: FieldId[]) {
    this.props.displayFields = new DisplayFields(ids)
  }

  static create(input: Omit<ICreateLookupFieldInput, 'type'>): LookupField {
    return new LookupField({
      ...super.createBase(input),
      displayFields: new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id))),
    })
  }

  static unsafeCreate(input: ICreateLookupFieldInput): LookupField {
    return new LookupField({
      ...super.unsafeCreateBase(input),
      displayFields: new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id))),
    })
  }

  createValue(value: ICreateLookupFieldValue): LookupFieldValue {
    return new LookupFieldValue(value)
  }

  createFilter(operator: ILookupFilterOperator, value: string[] | null): ILookupFilter {
    return { operator, value, path: this.id.value, type: 'lookup' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.lookup(this)
  }

  get valueSchema() {
    return z.string().array().nullable()
  }

  getDisplayValues(values?: IRecordDisplayValues): (string | null)[][] {
    if (isEmpty(this.displayFieldIds)) {
      return pipe(
        map((id: string) => values?.[this.id.value]?.[id] ?? []),
        unzip,
      )(['id'])
    }

    return pipe(
      map((displayFieldId: FieldId) => values?.[this.id.value]?.[displayFieldId.value] ?? []),
      unzip,
    )(this.displayFieldIds)
  }
}

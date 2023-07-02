import { z } from 'zod'
import type { IRecordDisplayValues, RecordValueJSON } from '../../../record/index.js'
import { BaseField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { UrlFieldValue } from './url-field-value.js'
import type { ICreateUrlFieldInput, ICreateUrlFieldValue, IUrlField, UrlFieldType } from './url-field.type.js'
import type { IUrlFilter, IUrlFilterOperator } from './url.filter.js'

export class UrlField extends BaseField<IUrlField> {
  duplicate(name: string): UrlField {
    return UrlField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }
  type: UrlFieldType = 'url'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateUrlFieldInput, 'type'>): UrlField {
    return new UrlField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateUrlFieldInput): UrlField {
    return new UrlField(super.unsafeCreateBase(input))
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    return valueJson[this.id.value] ?? null
  }

  createValue(value: ICreateUrlFieldValue): UrlFieldValue {
    return new UrlFieldValue(value)
  }

  createFilter(operator: IUrlFilterOperator, value: string | null): IUrlFilter {
    return { operator, value, path: this.id.value, type: 'url' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.url(this)
  }

  get valueSchema() {
    const url = z.string()
    return this.required ? url.url() : url.nullable()
  }
}

import { z } from 'zod'
import type { IJsonFilter, IJsonFilterOperator } from '../filter/json.filter.js'
import type { IRecordDisplayValues, RecordValueJSON } from '../record/index.js'
import { BaseField } from './field.base.js'
import type { IJsonField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { JsonFieldValue } from './json-field-value.js'
import type { ICreateJsonFieldInput, ICreateJsonFieldValue, JsonFieldType } from './json-field.type.js'
import { FieldId } from './value-objects/field-id.vo.js'

export class JsonField extends BaseField<IJsonField> {
  duplicate(name: string): JsonField {
    return JsonField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }
  type: JsonFieldType = 'json'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateJsonFieldInput, 'type'>): JsonField {
    return new JsonField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateJsonFieldInput): JsonField {
    return new JsonField(super.unsafeCreateBase(input))
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    return valueJson[this.id.value] ?? null
  }

  createValue(value: ICreateJsonFieldValue): JsonFieldValue {
    return new JsonFieldValue(value)
  }

  createFilter(operator: IJsonFilterOperator, value: null): IJsonFilter {
    return { operator, value, path: this.id.value, type: 'json' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.json(this)
  }

  get valueSchema() {
    const json = z.record(z.any())
    return this.required ? json : json.nullable()
  }
}

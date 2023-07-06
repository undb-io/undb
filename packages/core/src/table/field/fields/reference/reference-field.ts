import { Option } from 'oxide.ts'
import { Mixin } from 'ts-mixer'
import { z } from 'zod'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import type { IRecordDisplayValues } from '../../../record/record.type.js'
import { TableId } from '../../../value-objects/table-id.vo.js'
import { AbstractLookingField, AbstractReferenceField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { DisplayFields } from '../../value-objects/display-fields.vo.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { FieldIssue } from '../../value-objects/field-issue.vo.js'
import { ReferenceFieldValue } from './reference-field-value.js'
import type {
  ICreateReferenceFieldInput,
  ICreateReferenceFieldValue,
  IReferenceField,
  IReferenceFieldIssues,
  ReferenceFieldIssue,
  ReferenceFieldType,
} from './reference-field.type.js'
import type { IReferenceFilter, IReferenceFilterOperator } from './reference.filter.js'

export class ReferenceField extends Mixin(
  AbstractReferenceField<IReferenceField>,
  AbstractLookingField<IReferenceField>,
) {
  duplicate(name: string): ReferenceField {
    return ReferenceField.create({
      ...this.json,
      symmetricReferenceFieldId: undefined,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }
  type: ReferenceFieldType = 'reference'

  override get json() {
    return {
      ...super.json,
      displayFieldIds: this.displayFieldIds.map((id) => id.value),
      foreignTableId: this.foreignTableId.into(undefined),
      symmetricReferenceFieldId: this.symmetricReferenceFieldId?.value,
      isOwner: this.isOwner,
    }
  }

  get multiple() {
    return true
  }

  override get foreignTableId(): Option<string> {
    return Option(this.props.foreignTableId?.value)
  }

  override set foreignTableId(id: Option<string>) {
    if (id.isNone()) return
    this.props.foreignTableId = TableId.from(id.unwrap()).unwrap()
  }

  override get issues(): ReferenceFieldIssue[] {
    const issues: ReferenceFieldIssue[] = []

    if (this.foreignTableId.isNone()) {
      issues.push(new FieldIssue<IReferenceFieldIssues>({ value: 'Missing Foreign Table' }))
    }

    return issues
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    return this.getDisplayValues(displayValues)?.toString() ?? null
  }

  get isOneway(): boolean {
    return !this.isTwoway
  }

  get isTwoway(): boolean {
    return !!this.symmetricReferenceFieldId
  }

  get symmetricReferenceFieldId() {
    return this.props.symmetricReferenceFieldId
  }

  set symmetricReferenceFieldId(fieldId: FieldId | undefined) {
    this.props.symmetricReferenceFieldId = fieldId
  }

  get isOwner() {
    return this.props.isOwner ?? false
  }

  static create(input: Omit<ICreateReferenceFieldInput, 'type'>): ReferenceField {
    return new ReferenceField({
      ...super.createBase(input),
      foreignTableId: input.foreignTableId ? TableId.from(input.foreignTableId).unwrap() : undefined,
      displayFields: input.displayFieldIds
        ? new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id)))
        : undefined,
      isOwner: !!input.bidirectional,
      symmetricReferenceFieldId: input.symmetricReferenceFieldId
        ? FieldId.fromString(input.symmetricReferenceFieldId)
        : undefined,
    })
  }

  static unsafeCreate(input: ICreateReferenceFieldInput): ReferenceField {
    return new ReferenceField({
      ...super.unsafeCreateBase(input),
      foreignTableId: input.foreignTableId ? TableId.from(input.foreignTableId).unwrap() : undefined,
      displayFields: input.displayFieldIds
        ? new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id)))
        : undefined,
      isOwner: !!input.bidirectional,
      symmetricReferenceFieldId: input.symmetricReferenceFieldId
        ? FieldId.fromString(input.symmetricReferenceFieldId)
        : undefined,
    })
  }

  createValue(value: ICreateReferenceFieldValue): ReferenceFieldValue {
    return new ReferenceFieldValue(value)
  }

  createFilter(operator: IReferenceFilterOperator, value: null): IReferenceFilter {
    return { operator, value, path: this.id.value, type: 'reference' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.reference(this)
  }

  get valueSchema() {
    return this.required ? z.string().array() : z.string().array().nullable()
  }
}

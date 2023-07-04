import { unzip } from 'lodash-es'
import { z } from 'zod'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import type { IRecordDisplayValues } from '../../../record/record.type.js'
import { BaseField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { CollaboratorFieldValue } from './collaborator-field-value.js'
import type {
  CollaboratorFieldType,
  ICollaboratorField,
  ICreateCollaboratorFieldInput,
  ICreateCollaboratorFieldValue,
} from './collaborator-field.type.js'
import type { ICollaboratorFilter, ICollaboratorFilterOperator } from './collaborator.filter.js'

export class CollaboratorField extends BaseField<ICollaboratorField> {
  duplicate(name: string): CollaboratorField {
    return CollaboratorField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }
  type: CollaboratorFieldType = 'collaborator'

  get multiple() {
    return true
  }

  static create(input: Omit<ICreateCollaboratorFieldInput, 'type'>): CollaboratorField {
    return new CollaboratorField({
      ...super.createBase(input),
    })
  }

  static unsafeCreate(input: ICreateCollaboratorFieldInput): CollaboratorField {
    return new CollaboratorField({
      ...super.unsafeCreateBase(input),
    })
  }

  getDisplayValue(
    valueJson: RecordValueJSON,
    displayValues?: Record<string, Record<string, (string | null)[] | null>> | undefined,
  ): string | null {
    return displayValues?.[this.id.value]?.username?.toString() ?? null
  }

  createValue(value: ICreateCollaboratorFieldValue): CollaboratorFieldValue {
    return new CollaboratorFieldValue(value)
  }

  createFilter(operator: ICollaboratorFilterOperator, value: null): ICollaboratorFilter {
    return { operator, value, path: this.id.value, type: 'collaborator' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.collaborator(this)
  }

  getDisplayValues(values?: IRecordDisplayValues): (string | null)[][] {
    return unzip([
      values?.[this.id.value]?.username ?? [],
      values?.[this.id.value]?.avatar ?? [],
      values?.[this.id.value]?.color ?? [],
    ])
  }

  get valueSchema() {
    return this.required ? z.string().array() : z.string().array().nullable()
  }
}

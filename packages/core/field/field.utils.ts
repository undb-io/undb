import type { Field, IFieldType, ReferenceFieldTypes } from './field.type.js'

const referenceFieldTypes: IFieldType[] = ['tree', 'parent', 'reference']

export const getReferenceFields = (fields: Field[]): ReferenceFieldTypes[] =>
  fields.filter((f) => referenceFieldTypes.includes(f.type)) as ReferenceFieldTypes[]

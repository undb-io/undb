import type { Field, IFieldType } from './field.type.js'
import type { ParentField } from './parent-field.js'
import type { TreeField } from './tree-field.js'

const referenceFieldTypes: IFieldType[] = ['tree', 'parent']

export const getReferenceFields = (fields: Field[]): (TreeField | ParentField)[] =>
  fields.filter((f) => referenceFieldTypes.includes(f.type)) as (TreeField | ParentField)[]

import type { Field, IFieldType } from './field.type'
import type { ParentField } from './parent-field'
import type { TreeField } from './tree-field'

const referenceFieldTypes: IFieldType[] = ['tree', 'parent']

export const getReferenceFields = (fields: Field[]): (TreeField | ParentField)[] =>
  fields.filter((f) => referenceFieldTypes.includes(f.type)) as (TreeField | ParentField)[]

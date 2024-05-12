import { None, andOptions, orOptions, type Option } from '@undb/domain'
import { isObject } from 'radash'
import type {
  INotRecordComositeSpecification,
  IRecordComositeSpecification,
} from '../records/record/record.composite-specification'
import type { IFieldFilter, MaybeFieldFilter, MaybeFieldFilterWithFieldId } from '../schema/fields/field-filter.type'
import type { AbstractField } from '../schema/fields/variants/abstract-field.vo'
import type { SchemaMap } from '../schema/schema.type'
import type { IFilterGroup, IFilterGroupChildren, MaybeFilterGroup } from './filter.type'

type Spec = Option<IRecordComositeSpecification | INotRecordComositeSpecification>

export const isGroup = (filter: IFilterGroup | IFieldFilter): filter is IFilterGroup =>
  Reflect.has(filter, 'conjunction')

const isMaybeGroup = (filter: MaybeFieldFilter | MaybeFilterGroup): filter is MaybeFilterGroup =>
  Reflect.has(filter, 'conjunction')

export const isFieldFilter = (filter: IFilterGroup | IFieldFilter): filter is IFieldFilter =>
  Reflect.has(filter, 'fieldId') && Reflect.has(filter, 'op')

const isMaybeFieldFilter = (filter: any): filter is MaybeFieldFilter => isObject(filter)

function getFieldSpec(schema: SchemaMap, filter: IFieldFilter): Spec {
  const field = schema.get(filter.fieldId) as AbstractField<any> | undefined
  if (!field) {
    return None
  }

  return field.getSpec(filter)
}

function getGroupOrFieldSpec(schema: SchemaMap, filter: IFilterGroup | IFieldFilter): Spec {
  if (isGroup(filter)) {
    return getGroupSpec(schema, filter)
  } else if (isFieldFilter(filter)) {
    return getFieldSpec(schema, filter)
  }

  return None
}

function getGroupSpec(schema: SchemaMap, filter: IFilterGroup): Spec {
  if (filter.conjunction === 'and') {
    const specs = filter.children.map((child) => getGroupOrFieldSpec(schema, child))
    return andOptions(...specs)
  } else if (filter.conjunction === 'or') {
    const specs = filter.children.map((child) => getGroupOrFieldSpec(schema, child))
    return orOptions(...specs)
  }
  return None
}

export function getSpec(schema: SchemaMap, filter: IFilterGroup): Spec {
  return getGroupSpec(schema, filter)
}

function isValidFieldFilter(schema: SchemaMap, filter: MaybeFieldFilter): filter is IFieldFilter {
  if (!filter.fieldId) return false
  const field = schema.get(filter.fieldId)
  if (!field) return false

  const parsed = field.validateFilter(filter as MaybeFieldFilterWithFieldId)
  return parsed.success
}

export function parseValidFilter(schema: SchemaMap, filter: MaybeFilterGroup): IFilterGroup {
  const children: IFilterGroupChildren = []

  for (const child of filter.children) {
    if (isMaybeGroup(child)) {
      const validChild = parseValidFilter(schema, child)
      children.push(validChild)
    } else if (isMaybeFieldFilter(child)) {
      if (isValidFieldFilter(schema, child)) {
        children.push(child)
      }
    }
  }

  return {
    conjunction: filter.conjunction,
    children,
  }
}

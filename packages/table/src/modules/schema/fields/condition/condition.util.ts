import { None, andOptions, orOptions, type Option } from "@undb/domain"
import type { ZodTypeAny, z } from "@undb/zod"
import { isObject, uid } from "radash"
import type {
  INotRecordComositeSpecification,
  IRecordComositeSpecification,
} from "../../../records/record/record.composite-specification"
import type { Schema } from "../../schema.vo"
import { FieldIdVo } from "../field-id.vo"
import type { AbstractField } from "../variants/abstract-field.vo"
import type { Conjunction, IConditionGroup, IConditionGroupChildren, MaybeConditionGroup } from "./condition.type"
import type { IFieldCondition, MaybeFieldCondition, MaybeFieldConditionWithFieldId } from "./field-condition.type"

type Spec = Option<IRecordComositeSpecification | INotRecordComositeSpecification>

export const isGroup = <OptionType extends z.ZodTypeAny>(
  condition: IConditionGroup<OptionType> | IFieldCondition<OptionType>,
): condition is IConditionGroup<OptionType> => isObject(condition) && Reflect.has(condition, "conjunction")

export const isMaybeGroup = <OptionType extends z.ZodTypeAny>(
  condition: MaybeFieldCondition | MaybeConditionGroup<OptionType>,
): condition is MaybeConditionGroup<OptionType> => isObject(condition) && Reflect.has(condition, "conjunction")

export const isFieldCondition = <OptionType extends z.ZodTypeAny>(
  condition: IConditionGroup<OptionType> | IFieldCondition<OptionType>,
): condition is IFieldCondition<OptionType> => Reflect.has(condition, "field") && Reflect.has(condition, "op")

export const isMaybeFieldCondition = (condition: any): condition is MaybeFieldCondition =>
  isObject(condition) && !Reflect.has(condition, "conjunction")

export function getFieldSpec<OptionType extends z.ZodTypeAny>(
  schema: Schema,
  condition: IFieldCondition<OptionType>,
): Spec {
  const field = schema.getFieldById(new FieldIdVo(condition.field)) as Option<AbstractField<any>>
  if (field.isNone()) {
    return None
  }

  return field.unwrap().getSpec(condition)
}

function getGroupOrFieldSpec<OptionType extends z.ZodTypeAny>(
  schema: Schema,
  condition: IConditionGroup<OptionType> | IFieldCondition<OptionType>,
): Spec {
  if (isGroup(condition)) {
    return getGroupSpec(schema, condition)
  } else if (isFieldCondition(condition)) {
    return getFieldSpec(schema, condition)
  }

  return None
}

function getGroupSpec<OptionType extends z.ZodTypeAny>(schema: Schema, condition: IConditionGroup<OptionType>): Spec {
  if (condition.conjunction === "and") {
    const specs = condition.children.map((child) => getGroupOrFieldSpec(schema, child))
    return andOptions(...specs)
  } else if (condition.conjunction === "or") {
    const specs = condition.children.map((child) => getGroupOrFieldSpec(schema, child))
    return orOptions(...specs)
  }
  return None
}

export function getSpec<OptionType extends z.ZodTypeAny>(schema: Schema, condition: IConditionGroup<OptionType>): Spec {
  return getGroupSpec(schema, condition)
}

function isValidFieldCondition<OptionType extends z.ZodTypeAny>(
  schema: Schema,
  condition: MaybeFieldCondition,
  optionType: OptionType,
) {
  if (!condition.field) return false
  const field = schema.getFieldById(new FieldIdVo(condition.field))
  if (field.isNone()) return false

  const parsed = field.unwrap().validateCondition(condition as MaybeFieldConditionWithFieldId, optionType)
  return parsed.success
}

export function toMaybeFieldCondition(condition: IFieldCondition): MaybeFieldCondition {
  return {
    id: uid(10),
    ...condition,
  } as MaybeFieldCondition
}

export function toMaybeConditionGroup<OptionType extends z.ZodTypeAny>(
  condition?: IConditionGroup<OptionType>,
): MaybeConditionGroup<OptionType> {
  if (!condition) {
    return {
      id: uid(10),
      conjunction: "and",
      children: [],
      option: {},
    }
  }

  return {
    id: uid(10),
    conjunction: condition.conjunction,
    children: condition.children.map((child) => {
      if (isGroup(child)) {
        return toMaybeConditionGroup(child)
      }

      if (isFieldCondition(child)) {
        return toMaybeFieldCondition(child)
      }

      return child
    }),
  }
}

export function getFlattenFieldConditions<OptionType extends z.ZodTypeAny>(
  condition: IConditionGroup<OptionType>,
): IFieldCondition<OptionType>[] {
  const result: IFieldCondition<OptionType>[] = []

  condition.children.forEach((child) => {
    if (isFieldCondition<OptionType>(child)) {
      result.push(child)
    } else if (isGroup(child)) {
      result.push(...getFlattenFieldConditions(child))
    }
  })

  return result
}

export function getFieldIdsFromConditionGroup<OptionType extends z.ZodTypeAny>(
  condition: IConditionGroup<OptionType>,
): string[] {
  const result: string[] = []

  condition.children.forEach((child) => {
    if (isFieldCondition(child)) {
      result.push(child.field)
    } else if (isGroup(child)) {
      result.push(...getFieldIdsFromConditionGroup(child))
    }
  })

  return result
}

export function parseValidCondition<OptionType extends z.ZodTypeAny>(optionType: OptionType) {
  function validate(schema: Schema, condition: MaybeConditionGroup<OptionType>): IConditionGroup<OptionType> {
    const children: IConditionGroupChildren<OptionType> = []

    for (const child of condition.children) {
      if (isMaybeGroup<OptionType>(child)) {
        const validChild = validate(schema, child)
        children.push(validChild)
      } else if (isMaybeFieldCondition(child)) {
        if (isValidFieldCondition(schema, child, optionType)) {
          const { id, ...value } = child
          children.push(value as IFieldCondition<OptionType>)
        }
      }
    }

    return {
      conjunction: condition.conjunction,
      children,
    }
  }

  return validate
}

export function isEmptyConditionGroup<OptionType extends z.ZodTypeAny>(
  condition: IConditionGroup<OptionType>,
): boolean {
  return condition.children.length === 0
}

export function getConditionGroupCount<OptionType extends z.ZodTypeAny>(
  condition: IConditionGroup<OptionType>,
): number {
  return condition.children.reduce((acc, child) => acc + (isGroup(child) ? getConditionGroupCount(child) : 1), 0)
}

/**
 * Removes field conditions from a condition group recursively, based on the provided field IDs.
 * If a child condition is a field condition and its field ID is not in the provided set of field IDs,
 * it will be removed from the condition group. If a child condition is a group, the function will be
 * called recursively to remove field conditions from the child group as well.
 *
 *
 * @template OptionType - The type of the options for the condition group.
 * @param value - The condition group to remove field conditions from.
 * @param fieldIds - The set of field IDs to check against for removing field conditions.
 * @returns The condition group with field conditions removed.
 */
export function conditionWithoutFields<OptionType extends z.ZodTypeAny>(
  value: IConditionGroup<OptionType>,
  fieldIds: Set<string>,
): IConditionGroup<OptionType> {
  const children: IConditionGroupChildren<OptionType> = []

  for (const child of value.children) {
    if (isFieldCondition(child) && !fieldIds.has(child.field)) {
      children.push(child)
    } else if (isGroup(child)) {
      const newChild = conditionWithoutFields(child, fieldIds)
      if (!isEmptyConditionGroup(newChild)) {
        children.push(newChild)
      }
    }
  }

  return {
    conjunction: value.conjunction,
    children,
  }
}

export function conditionContainsFields<OptionType extends ZodTypeAny>(
  value: IConditionGroup<OptionType>,
  fieldIds: Set<string>,
): boolean {
  for (const child of value.children) {
    if (isFieldCondition(child) && fieldIds.has(child.field)) {
      return true
    } else if (isGroup(child) && conditionContainsFields(child, fieldIds)) {
      return true
    }
  }

  return false
}

export function conditionsWithField<OptionType extends ZodTypeAny>(
  value: IConditionGroup<OptionType>,
  fieldId: string,
): IFieldCondition<OptionType>[] {
  const results: IFieldCondition<OptionType>[] = []

  for (const child of value.children) {
    if (isFieldCondition(child) && child.field === fieldId) {
      results.push(child)
    } else if (isGroup(child)) {
      results.push(...conditionsWithField(child, fieldId))
    }
  }

  return results
}

/**
 * Replaces the condition field name with the field ID in the given condition group.
 *
 * @param value - The condition group to modify.
 * @param schema - The schema containing the fields.
 * @returns The modified condition group with field IDs.
 */
export function replaceCondtionFieldNameWithFieldId<OptionType extends z.ZodTypeAny>(
  value: IConditionGroup<OptionType>,
  schema: Schema,
): IConditionGroup<OptionType> {
  const children: IConditionGroupChildren<OptionType> = []

  for (const child of value.children) {
    if (isFieldCondition(child)) {
      const field = schema.getFieldByIdOrName(child.field)
      if (field.isSome()) {
        const f = field.unwrap()
        children.push({ ...child, field: f.id.value })
      }
    } else if (isGroup(child)) {
      const newChild = replaceCondtionFieldNameWithFieldId(child, schema)
      if (!isEmptyConditionGroup(newChild)) {
        children.push(newChild)
      }
    }
  }

  return {
    conjunction: value.conjunction,
    children,
  }
}

export function mergeConditionGroups<OptionType extends z.ZodTypeAny>(
  a: IConditionGroup<OptionType>,
  b: IConditionGroup<OptionType>,
): IConditionGroup<OptionType> {
  return {
    conjunction: "and",
    children: [a, b],
  }
}

export function addMaybeCondition(
  value: MaybeConditionGroup<any> | undefined,
  condition: MaybeFieldCondition,
  conjunction: Conjunction = "and",
) {
  if (!value) {
    return {
      children: [condition],
      conjunction,
      id: uid(10),
      option: {},
    }
  }

  return {
    children: [...value.children, condition],
    conjunction,
    id: uid(10),
    option: {},
  }
}

export function addMaybeConditionGroup(
  value: MaybeConditionGroup<any> | undefined,
  conditionGroup: MaybeConditionGroup<any>,
  conjunction: Conjunction = "and",
) {
  if (!value) {
    return {
      children: [conditionGroup],
      conjunction,
      id: uid(10),
      option: {},
    }
  }

  return {
    children: [...value.children, conditionGroup],
    conjunction,
    id: uid(10),
    option: {},
  }
}

export function removeCondition(value: MaybeConditionGroup<any> | undefined, index: number) {
  if (!value) {
    return value
  }

  return {
    ...value,
    children: value.children.filter((_, i) => i !== index),
  }
}

export function swapCondition(value: MaybeConditionGroup<any> | undefined, oldIndex: number, newIndex: number) {
  if (!value) {
    return value
  }

  const children = [...value.children]
  const [removed] = children.splice(oldIndex, 1)
  children.splice(newIndex, 0, removed)

  return {
    ...value,
    children,
  }
}

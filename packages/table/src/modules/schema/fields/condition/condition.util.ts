import { None, andOptions, orOptions, type Option } from "@undb/domain"
import type { z } from "@undb/zod"
import { isObject, uid } from "radash"
import type {
  INotRecordComositeSpecification,
  IRecordComositeSpecification,
} from "../../../records/record/record.composite-specification"
import type { SchemaMap } from "../../schema.type"
import type { AbstractField } from "../variants/abstract-field.vo"
import type { IConditionGroup, IConditionGroupChildren, MaybeConditionGroup } from "./condition.type"
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
): condition is IFieldCondition<OptionType> => Reflect.has(condition, "fieldId") && Reflect.has(condition, "op")

export const isMaybeFieldCondition = (condition: any): condition is MaybeFieldCondition =>
  isObject(condition) && !Reflect.has(condition, "conjunction")

export function getFieldSpec<OptionType extends z.ZodTypeAny>(
  schema: SchemaMap,
  condition: IFieldCondition<OptionType>,
): Spec {
  const field = schema.get(condition.fieldId) as AbstractField<any> | undefined
  if (!field) {
    return None
  }

  return field.getSpec(condition)
}

function getGroupOrFieldSpec<OptionType extends z.ZodTypeAny>(
  schema: SchemaMap,
  condition: IConditionGroup<OptionType> | IFieldCondition<OptionType>,
): Spec {
  if (isGroup(condition)) {
    return getGroupSpec(schema, condition)
  } else if (isFieldCondition(condition)) {
    return getFieldSpec(schema, condition)
  }

  return None
}

function getGroupSpec<OptionType extends z.ZodTypeAny>(
  schema: SchemaMap,
  condition: IConditionGroup<OptionType>,
): Spec {
  if (condition.conjunction === "and") {
    const specs = condition.children.map((child) => getGroupOrFieldSpec(schema, child))
    return andOptions(...specs)
  } else if (condition.conjunction === "or") {
    const specs = condition.children.map((child) => getGroupOrFieldSpec(schema, child))
    return orOptions(...specs)
  }
  return None
}

export function getSpec<OptionType extends z.ZodTypeAny>(
  schema: SchemaMap,
  condition: IConditionGroup<OptionType>,
): Spec {
  return getGroupSpec(schema, condition)
}

function isValidFieldCondition<OptionType extends z.ZodTypeAny>(
  schema: SchemaMap,
  condition: MaybeFieldCondition,
  optionType: OptionType,
) {
  if (!condition.fieldId) return false
  const field = schema.get(condition.fieldId)
  if (!field) return false

  const parsed = field.validateCondition(condition as MaybeFieldConditionWithFieldId, optionType)
  return parsed.success
}

export function toMaybeFieldCondition(condition: IFieldCondition): MaybeFieldCondition {
  return {
    id: uid(10),
    ...condition,
  } as MaybeFieldCondition
}

export function toMaybeConditionGroup<OptionType extends z.ZodTypeAny>(
  condition: IConditionGroup<OptionType>,
): MaybeConditionGroup<OptionType> {
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

export function parseValidCondition<OptionType extends z.ZodTypeAny>(optionType: OptionType) {
  function validate(schema: SchemaMap, condition: MaybeConditionGroup<OptionType>): IConditionGroup<OptionType> {
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

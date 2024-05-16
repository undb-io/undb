import { None, andOptions, orOptions, type Option } from "@undb/domain"
import { isObject, uid } from "radash"
import type { z } from "zod"
import type {
  INotRecordComositeSpecification,
  IRecordComositeSpecification,
} from "../../../records/record/record.composite-specification"
import type { SchemaMap } from "../../schema.type"
import type { AbstractField } from "../variants/abstract-field.vo"
import type { IConditionGroup, IConditionGroupChildren, MaybeConditionGroup } from "./condition.type"
import type { IFieldCondition, MaybeFieldCondition, MaybeFieldConditionWithFieldId } from "./field-condition.type"

type Spec = Option<IRecordComositeSpecification | INotRecordComositeSpecification>

export const isGroup = <OptionType>(
  condition: IConditionGroup<OptionType> | IFieldCondition,
): condition is IConditionGroup<OptionType> => isObject(condition) && Reflect.has(condition, "conjunction")

export const isMaybeGroup = <OptionType>(
  condition: MaybeFieldCondition | MaybeConditionGroup<OptionType>,
): condition is MaybeConditionGroup<OptionType> => isObject(condition) && Reflect.has(condition, "conjunction")

export const isFieldCondition = <OptionType>(
  condition: IConditionGroup<OptionType> | IFieldCondition,
): condition is IFieldCondition => Reflect.has(condition, "fieldId") && Reflect.has(condition, "op")

export const isMaybeFieldCondition = (condition: any): condition is MaybeFieldCondition =>
  isObject(condition) && !Reflect.has(condition, "conjunction")

function getFieldSpec(schema: SchemaMap, condition: IFieldCondition): Spec {
  const field = schema.get(condition.fieldId) as AbstractField<any> | undefined
  if (!field) {
    return None
  }

  return field.getSpec(condition)
}

function getGroupOrFieldSpec<OptionType>(
  schema: SchemaMap,
  condition: IConditionGroup<OptionType> | IFieldCondition,
): Spec {
  if (isGroup(condition)) {
    return getGroupSpec(schema, condition)
  } else if (isFieldCondition(condition)) {
    return getFieldSpec(schema, condition)
  }

  return None
}

function getGroupSpec<OptionType>(schema: SchemaMap, condition: IConditionGroup<OptionType>): Spec {
  if (condition.conjunction === "and") {
    const specs = condition.children.map((child) => getGroupOrFieldSpec(schema, child))
    return andOptions(...specs)
  } else if (condition.conjunction === "or") {
    const specs = condition.children.map((child) => getGroupOrFieldSpec(schema, child))
    return orOptions(...specs)
  }
  return None
}

export function getSpec<OptionType>(schema: SchemaMap, condition: IConditionGroup<OptionType>): Spec {
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

export function toMaybeConditionGroup<OptionType>(
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

export function parseValidCondition<OptionType extends z.ZodTypeAny>(optionType: OptionType) {
  function validate(
    schema: SchemaMap,
    condition: MaybeConditionGroup<z.infer<OptionType>>,
  ): IConditionGroup<z.infer<OptionType>> {
    const children: IConditionGroupChildren<OptionType> = []

    for (const child of condition.children) {
      if (isMaybeGroup<OptionType>(child)) {
        const validChild = validate(schema, child)
        children.push(validChild)
      } else if (isMaybeFieldCondition(child)) {
        if (isValidFieldCondition(schema, child, optionType)) {
          const { id, ...value } = child
          children.push(value as IFieldCondition)
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

export function isEmptyConditionGroup<OptionType>(condition: IConditionGroup<OptionType>): boolean {
  return condition.children.length === 0
}

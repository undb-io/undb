import { z } from "@undb/zod"
import { match } from "ts-pattern"
import { createBaseConditionSchema } from "../../condition/base.condition"
import type { FieldId } from "../../field-id.vo"
import {
  NumberEmpty,
  NumberEqual,
  NumberGT,
  NumberGTE,
  NumberLT,
  NumberLTE,
} from "./abstract-number-value.specification"

export function createAbstractNumberFieldCondition<OptionType extends z.ZodTypeAny>(optionType: OptionType) {
  const base = createBaseConditionSchema(optionType)
  return z.union([
    z.object({ op: z.literal("eq"), value: z.number() }).merge(base),
    z.object({ op: z.literal("neq"), value: z.number() }).merge(base),
    z.object({ op: z.literal("gt"), value: z.number() }).merge(base),
    z.object({ op: z.literal("gte"), value: z.number() }).merge(base),
    z.object({ op: z.literal("lt"), value: z.number() }).merge(base),
    z.object({ op: z.literal("lte"), value: z.number() }).merge(base),
    z.object({ op: z.literal("is_empty"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_not_empty"), value: z.undefined() }).merge(base),
  ])
}

export const createAbstractNumberFieldMather = (
  condition: z.infer<ReturnType<typeof createAbstractNumberFieldCondition>>,
  fieldId: FieldId,
) =>
  match(condition)
    .with({ op: "eq" }, ({ value }) => new NumberEqual(value, fieldId))
    .with({ op: "neq" }, ({ value }) => new NumberEqual(value, fieldId).not())
    .with({ op: "gt" }, ({ value }) => new NumberGT(value, fieldId))
    .with({ op: "gte" }, ({ value }) => new NumberGTE(value, fieldId))
    .with({ op: "lt" }, ({ value }) => new NumberLT(value, fieldId))
    .with({ op: "lte" }, ({ value }) => new NumberLTE(value, fieldId))
    .with({ op: "is_empty" }, () => new NumberEmpty(fieldId))
    .with({ op: "is_not_empty" }, () => new NumberEmpty(fieldId).not())

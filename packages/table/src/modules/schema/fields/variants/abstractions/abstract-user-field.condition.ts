import { z } from "@undb/zod"
import { match } from "ts-pattern"
import { createBaseConditionSchema } from "../../condition/base.condition"
import type { FieldId } from "../../field-id.vo"
import { UserEmpty, UserEqual } from "./abstract-user-value.specification"

export function createAbstractUserFieldCondition<OptionType extends z.ZodTypeAny>(optionType: OptionType) {
  const base = createBaseConditionSchema(optionType)
  return z.union([
    z.object({ op: z.literal("eq"), value: z.string() }).merge(base),
    z.object({ op: z.literal("neq"), value: z.string() }).merge(base),
    z.object({ op: z.literal("is_empty"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_not_empty"), value: z.undefined() }).merge(base),
  ])
}

export const createAbstractUserFieldMather = (
  condition: z.infer<ReturnType<typeof createAbstractUserFieldCondition>>,
  fieldId: FieldId,
) =>
  match(condition)
    .with({ op: "eq" }, ({ value }) => new UserEqual(value, fieldId))
    .with({ op: "neq" }, ({ value }) => new UserEqual(value, fieldId).not())
    .with({ op: "is_empty" }, () => new UserEmpty(fieldId))
    .with({ op: "is_not_empty" }, () => new UserEmpty(fieldId).not())

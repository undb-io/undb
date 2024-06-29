import { isNumber, isObject, isString } from "radash"
import { P, match } from "ts-pattern"
import type { IInferCreateFieldDTO } from "./dto/field.dto"
import type { FieldType, NoneSystemFieldType, SystemFieldType } from "./field.type"
import { Options } from "./option/options.vo"
import type { ICreateSelectFieldDTO, IRollupFn } from "./variants"

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isDateValue(value: unknown): boolean {
  if (typeof value === "string") {
    const timestamp = Date.parse(value)
    return !isNaN(timestamp)
  }
  return false
}

function isJsonValue(value: unknown): boolean {
  return isObject(value)
}

function isNumberValue(value: unknown): boolean {
  return match(value)
    .returnType<boolean>()
    .when(isNumber, () => true)
    .when(isString, (v) => /^-?\d+$/.test(v))
    .otherwise(() => false)
}

export const inferCreateFieldType = (values: (string | number | null | object | boolean)[]): IInferCreateFieldDTO => {
  const distinctValues = Array.from(new Set(values))
    .map((s) => (isString(s) ? s.trim() : s))
    .filter(Boolean) as (string | number)[]

  return match(values)
    .returnType<IInferCreateFieldDTO>()
    .with(P.array(P.string.regex(EMAIL_REGEXP)), () => ({ type: "email" }))
    .with(P.array(P.boolean), () => ({ type: "checkbox" }))
    .with(P.array(P.when(isNumberValue)), () => ({ type: "number" }))
    .with(P.array(P.when(isDateValue)), () => ({ type: "date" }))
    .with(P.array(P.when(isJsonValue)), () => ({ type: "json" }))
    .with(
      P.array(P.when((v) => isString(v) && (v.toLocaleLowerCase() === "true" || v.toLocaleLowerCase() === "false"))),
      () => ({ type: "checkbox" }),
    )
    .when(
      (distinctValues) => {
        const distinctValuesCount = distinctValues.length
        const valuesCount = values.length
        return distinctValuesCount / valuesCount < 0.5 && valuesCount > 10 && distinctValuesCount < 100
      },
      () =>
        ({
          option: {
            options: Options.fromStrings(distinctValues.map((value) => value.toString() ?? "")).toJSON(),
          },
          type: "select",
        }) as Omit<ICreateSelectFieldDTO, "id" | "name">,
    )
    .with(P.array(P.string), () => ({ type: "string" }))
    .otherwise(() => ({ type: "string" }))
}

const sortableFieldTypes: FieldType[] = [
  "string",
  "id",
  "createdAt",
  "updatedAt",
  "autoIncrement",
  "createdBy",
  "rollup",
  "select",
  "rating",
  "email",
  "date",
  "json",
  "checkbox",
] as const

export function isFieldSortable(type: FieldType): boolean {
  return sortableFieldTypes.includes(type)
}

const systemFieldTyeps: Set<FieldType> = new Set(["id", "createdAt", "createdBy", "updatedAt", "autoIncrement"])
export function getIsSystemFieldType(type: FieldType): type is SystemFieldType {
  return systemFieldTyeps.has(type)
}

export const fieldTypes: NoneSystemFieldType[] = [
  "string",
  "number",
  "reference",
  "rollup",
  "select",
  "rating",
  "email",
  "attachment",
  "date",
  "json",
  "checkbox",
] as const
export const systemFieldTypes: SystemFieldType[] = [
  "id",
  "autoIncrement",
  "createdAt",
  "createdBy",
  "updatedAt",
  "updatedBy",
] as const

export const allFieldTypes: FieldType[] = [...systemFieldTypes, ...fieldTypes] as const

export const fieldsCanBeRollup: FieldType[] = ["number", "string", "rating", "email", "date", "checkbox"] as const

export const getIsFieldCanBeRollup = (type: FieldType): type is "number" => {
  return fieldsCanBeRollup.includes(type)
}

export function getRollupFnByType(type: FieldType): IRollupFn[] {
  return match(type)
    .returnType<IRollupFn[]>()
    .with("number", () => ["sum", "average", "max", "min", "count", "lookup"])
    .with("string", () => ["count", "lookup"])
    .otherwise(() => [])
}

export const castFieldValue = (type: FieldType, value: string | number | null | object | boolean) => {
  return match(type)
    .with("number", () => {
      if (isNumber(value)) return value
      return value ? Number(value) : null
    })
    .with("checkbox", () =>
      match(value)
        .returnType<boolean>()
        .with(["true", "TRUE"], () => true)
        .with(["false", "FALSE"], () => false)
        .otherwise(Boolean),
    )
    .with("select", () => value || null)
    .otherwise(() => value)
}

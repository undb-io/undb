import { isNumber, isObject, isString } from "radash"
import { P, match } from "ts-pattern"
import type { ICreateSchemaDTO } from "../dto/create-schema.dto"
import type { IInferCreateFieldDTO } from "./dto/field.dto"
import type { FieldType, IFilterableFieldType, NoneSystemFieldType, SystemFieldType } from "./field.type"
import { Options } from "./option/options.vo"
import type { ICreateSelectFieldDTO, IRollupFn } from "./variants"

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_REGEXP = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

export function isDateValue(value: unknown): boolean {
  if (typeof value === "string") {
    const timestamp = Date.parse(value)
    return !isNaN(timestamp)
  }
  return false
}

export function isJsonValue(value: unknown): boolean {
  return isObject(value)
}

export function isCurrencyValue(value: unknown): boolean {
  if (typeof value !== "number" && typeof value !== "string") return false

  const stringValue = value.toString()

  // 检查是否包含逗号
  if (stringValue.includes(",")) {
    return /^-?\d{1,3}(,\d{3})*(\.\d{2})?$/.test(stringValue)
  }

  // 检查是否有一个小数点和两位小数
  if (/^-?\d+\.\d{2}$/.test(stringValue)) {
    return true
  }

  // 检查是否为整数
  return /^-?\d+$/.test(stringValue)
}

export function isNumberValue(value: unknown): boolean {
  return match(value)
    .returnType<boolean>()
    .when(isNumber, () => true)
    .when(isString, (v) => /^-?\d+(\.\d+)?$/.test(v))
    .otherwise(() => false)
}

export const inferCreateFieldType = (values: (string | number | null | object | boolean)[]): IInferCreateFieldDTO => {
  const distinctValues = Array.from(new Set(values))
    .map((s) => (isString(s) ? s.trim() : s))
    .filter(Boolean) as (string | number)[]

  return match(distinctValues)
    .returnType<IInferCreateFieldDTO>()
    .when(
      (p) => !p.length,
      () => ({ type: "string" }),
    )
    .with(P.array(P.string.regex(EMAIL_REGEXP)), () => ({ type: "email" }))
    .with(P.array(P.string.regex(URL_REGEXP)), () => ({ type: "url" }))
    .with(P.array(P.boolean), () => ({ type: "checkbox" }))
    .with(P.array(P.when(isCurrencyValue)), () => ({ type: "currency", option: { symbol: "$" } }))
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
          constraint: {
            max: 1,
          },
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
  "checkbox",
  "url",
  "duration",
  "percentage",
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
  "longText",
  "number",
  "select",
  "email",
  "url",
  "rating",
  "date",
  "checkbox",
  "attachment",
  "json",
  "user",
  "reference",
  "rollup",
  "currency",
  "button",
  "duration",
  "percentage",
] as const

export const systemFieldTypes: SystemFieldType[] = [
  "id",
  "autoIncrement",
  "createdAt",
  "createdBy",
  "updatedAt",
  "updatedBy",
] as const

export const systemFieldNames = ["id", "autoIncrement", "createdAt", "createdBy", "updatedAt", "updatedBy"] as const

export const filterableFieldTypes = [
  "string",
  "longText",
  "number",
  "autoIncrement",
  "checkbox",
  "createdAt",
  "createdBy",
  "date",
  "email",
  "url",
  "id",
  "number",
  "rating",
  "select",
  "updatedAt",
  "updatedBy",
  "user",
  "json",
  "currency",
  "duration",
  "percentage",
] as const

export const getIsFilterableFieldType = (type: FieldType): type is IFilterableFieldType => {
  return filterableFieldTypes.includes(type as any)
}

export const mutableFieldTypes = [
  "string",
  "number",
  "reference",
  "select",
  "rating",
  "email",
  "url",
  "attachment",
  "date",
  "json",
  "checkbox",
  "user",
  "longText",
  "currency",
  "duration",
  "percentage",
] as const

export const getIsMutableFieldType = (type: FieldType) => mutableFieldTypes.includes(type as any)

export const allFieldTypes: FieldType[] = [...systemFieldTypes, ...fieldTypes] as const

export const fieldsCanBeRollup: FieldType[] = [
  "number",
  "string",
  "rating",
  "email",
  "url",
  "date",
  "checkbox",
  "currency",
  "duration",
  "percentage",
] as const

export const getIsFieldCanBeRollup = (type: FieldType): type is "number" => {
  return fieldsCanBeRollup.includes(type)
}

export function getRollupFnByType(type: FieldType): IRollupFn[] {
  return match(type)
    .returnType<IRollupFn[]>()
    .with("number", "rating", "currency", "duration", "percentage", () => [
      "sum",
      "average",
      "max",
      "min",
      "count",
      "lookup",
    ])
    .with("date", () => ["max", "min", "count", "lookup"])
    .with("string", "email", "url", "checkbox", () => ["lookup", "count"])
    .otherwise(() => [])
}

export const castFieldValue = (dto: ICreateSchemaDTO[0], value: string | number | null | object | boolean) => {
  return match(dto)
    .with({ type: "number" }, { type: "currency" }, { type: "duration" }, { type: "percentage" }, () => {
      if (isNumber(value)) return value
      return value ? Number(value) : null
    })
    .with({ type: "checkbox" }, () =>
      match(value)
        .returnType<boolean>()
        .with(["true", "TRUE"], () => true)
        .with(["false", "FALSE"], () => false)
        .otherwise(Boolean),
    )
    .with({ type: "select" }, (dto) => {
      if (dto.constraint?.max === 1) {
        return value || null
      }

      return String(value)
        .split(",")
        .map((s) => s.trim())
    })
    .with({ type: "date" }, () => (isString(value) ? new Date(value).toISOString() : null))
    .otherwise(() => value)
}

export const displayFieldTypes: FieldType[] = [
  "string",
  "number",
  "select",
  "user",
  "autoIncrement",
  "date",
  "email",
  "url",
  "id",
  "rating",
  "currency",
  "duration",
  "percentage",
] as const

export const getIsDisplayFieldType = (type: FieldType): type is (typeof displayFieldTypes)[number] => {
  return displayFieldTypes.includes(type)
}

const fieldTypesHasDisplayValue = new Set<FieldType>(["select", "user", "createdBy", "updatedBy", "reference"])

export const getIsFieldHasDisplayValue = (type: FieldType): boolean => {
  return fieldTypesHasDisplayValue.has(type)
}

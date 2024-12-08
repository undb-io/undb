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
    .with(P.array(P.when(isNumberValue)), () => ({ type: "number" }))
    .with(P.array(P.when(isCurrencyValue)), () => ({ type: "currency", option: { symbol: "$" } }))
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
  "currency",
  "rollup",
  "select",
  "number",
  "rating",
  "email",
  "date",
  "checkbox",
  "url",
  "duration",
  "percentage",
  "formula",
  "dateRange",
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
  "duration",
  "percentage",
  "currency",
  "rating",
  "date",
  "dateRange",
  "formula",
  "select",
  "email",
  "url",
  "checkbox",
  "attachment",
  "json",
  "user",
  "reference",
  "rollup",
  "button",
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
  "checkbox",
  "email",
  "url",
  "id",
  "number",
  "rating",
  "percentage",
  "duration",
  "currency",
  "formula",
  "select",
  "date",
  "dateRange",
  "user",
  "json",
  "autoIncrement",
  "createdAt",
  "createdBy",
  "updatedAt",
  "updatedBy",
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
  "dateRange",
] as const

export const getIsMutableFieldType = (type: FieldType) => mutableFieldTypes.includes(type as any)

// TODO: move formula to fieldTypes
export const allFieldTypes: FieldType[] = [...systemFieldTypes, ...fieldTypes, "formula"] as const

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
  "select",
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
    .with("string", "email", "url", "checkbox", "select", () => ["lookup", "count"])
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

export type ChangeTypeStrategy = "cast" | "clear" | "ignore" | "disabled"

export const changeTypeStrategies: Record<NoneSystemFieldType, Record<NoneSystemFieldType, ChangeTypeStrategy>> = {
  string: {
    string: "ignore",
    number: "cast",
    select: "cast",
    user: "clear",
    date: "cast",
    email: "cast",
    url: "cast",
    duration: "cast",
    currency: "cast",
    json: "cast",
    checkbox: "cast",
    longText: "cast",
    reference: "disabled",
    rollup: "ignore",
    rating: "cast",
    attachment: "cast",
    button: "ignore",
    percentage: "cast",
    formula: "ignore",
    dateRange: "clear",
  },
  number: {
    string: "cast",
    number: "ignore",
    select: "clear",
    user: "clear",
    date: "clear",
    email: "clear",
    url: "clear",
    duration: "cast",
    currency: "cast",
    json: "clear",
    checkbox: "cast",
    longText: "clear",
    reference: "disabled",
    rollup: "ignore",
    rating: "cast",
    attachment: "clear",
    button: "ignore",
    percentage: "cast",
    formula: "ignore",
    dateRange: "clear",
  },
  select: {
    string: "cast",
    number: "clear",
    select: "ignore",
    user: "clear",
    date: "clear",
    email: "clear",
    url: "clear",
    duration: "clear",
    currency: "clear",
    json: "clear",
    checkbox: "cast",
    longText: "cast",
    reference: "disabled",
    rollup: "ignore",
    rating: "clear",
    attachment: "clear",
    button: "ignore",
    percentage: "clear",
    formula: "ignore",
    dateRange: "clear",
  },
  user: {
    string: "cast",
    number: "clear",
    select: "clear",
    user: "ignore",
    date: "clear",
    email: "clear",
    url: "clear",
    duration: "clear",
    currency: "clear",
    json: "clear",
    checkbox: "clear",
    longText: "cast",
    reference: "disabled",
    rollup: "ignore",
    rating: "clear",
    attachment: "clear",
    button: "ignore",
    percentage: "clear",
    formula: "ignore",
    dateRange: "clear",
  },
  date: {
    string: "cast",
    number: "clear",
    select: "clear",
    user: "clear",
    date: "ignore",
    email: "clear",
    url: "clear",
    duration: "clear",
    currency: "clear",
    json: "clear",
    checkbox: "clear",
    longText: "cast",
    reference: "disabled",
    rollup: "ignore",
    rating: "clear",
    attachment: "clear",
    button: "ignore",
    percentage: "clear",
    formula: "ignore",
    dateRange: "cast",
  },
  email: {
    string: "cast",
    number: "clear",
    select: "clear",
    user: "clear",
    date: "clear",
    email: "ignore",
    url: "cast",
    duration: "clear",
    currency: "clear",
    json: "clear",
    checkbox: "clear",
    longText: "cast",
    reference: "disabled",
    rollup: "ignore",
    rating: "clear",
    attachment: "clear",
    button: "ignore",
    percentage: "clear",
    formula: "ignore",
    dateRange: "clear",
  },
  url: {
    string: "cast",
    number: "clear",
    select: "clear",
    user: "clear",
    date: "clear",
    email: "cast",
    url: "ignore",
    duration: "clear",
    currency: "clear",
    json: "clear",
    checkbox: "clear",
    longText: "cast",
    reference: "disabled",
    rollup: "ignore",
    rating: "clear",
    attachment: "clear",
    button: "ignore",
    percentage: "clear",
    formula: "ignore",
    dateRange: "clear",
  },
  duration: {
    string: "cast",
    number: "cast",
    select: "clear",
    user: "clear",
    date: "clear",
    email: "clear",
    url: "clear",
    duration: "ignore",
    currency: "cast",
    json: "clear",
    checkbox: "clear",
    longText: "cast",
    reference: "disabled",
    rollup: "ignore",
    rating: "clear",
    attachment: "clear",
    button: "ignore",
    percentage: "clear",
    formula: "ignore",
    dateRange: "clear",
  },
  currency: {
    string: "cast",
    number: "cast",
    select: "clear",
    user: "clear",
    date: "clear",
    email: "clear",
    url: "clear",
    duration: "cast",
    currency: "ignore",
    json: "clear",
    checkbox: "clear",
    longText: "cast",
    reference: "disabled",
    rollup: "ignore",
    rating: "clear",
    attachment: "clear",
    button: "ignore",
    percentage: "cast",
    formula: "ignore",
    dateRange: "clear",
  },
  json: {
    string: "cast",
    number: "clear",
    select: "clear",
    user: "clear",
    date: "clear",
    email: "clear",
    url: "clear",
    duration: "clear",
    currency: "clear",
    json: "ignore",
    checkbox: "clear",
    longText: "cast",
    reference: "disabled",
    rollup: "ignore",
    rating: "clear",
    attachment: "clear",
    button: "ignore",
    percentage: "clear",
    formula: "ignore",
    dateRange: "clear",
  },
  checkbox: {
    string: "cast",
    number: "cast",
    select: "cast",
    user: "clear",
    date: "clear",
    email: "clear",
    url: "clear",
    duration: "clear",
    currency: "clear",
    json: "clear",
    checkbox: "ignore",
    longText: "cast",
    reference: "disabled",
    rollup: "ignore",
    rating: "clear",
    attachment: "clear",
    button: "ignore",
    percentage: "clear",
    formula: "ignore",
    dateRange: "clear",
  },
  longText: {
    string: "cast",
    number: "clear",
    select: "cast",
    user: "clear",
    date: "clear",
    email: "clear",
    url: "clear",
    duration: "clear",
    currency: "clear",
    json: "clear",
    checkbox: "cast",
    longText: "ignore",
    reference: "disabled",
    rollup: "ignore",
    rating: "clear",
    attachment: "clear",
    button: "ignore",
    percentage: "clear",
    formula: "ignore",
    dateRange: "clear",
  },
  reference: {
    string: "disabled",
    number: "disabled",
    select: "disabled",
    user: "disabled",
    date: "disabled",
    email: "disabled",
    url: "disabled",
    duration: "disabled",
    currency: "disabled",
    json: "disabled",
    checkbox: "disabled",
    longText: "disabled",
    reference: "disabled",
    rollup: "disabled",
    rating: "disabled",
    attachment: "disabled",
    button: "disabled",
    percentage: "disabled",
    formula: "disabled",
    dateRange: "disabled",
  },
  rollup: {
    string: "ignore",
    number: "ignore",
    select: "ignore",
    user: "ignore",
    date: "ignore",
    email: "ignore",
    url: "ignore",
    duration: "ignore",
    currency: "ignore",
    json: "ignore",
    checkbox: "ignore",
    longText: "ignore",
    reference: "ignore",
    rollup: "ignore",
    rating: "ignore",
    attachment: "ignore",
    button: "ignore",
    percentage: "ignore",
    formula: "ignore",
    dateRange: "ignore",
  },
  rating: {
    string: "cast",
    number: "cast",
    select: "clear",
    user: "clear",
    date: "clear",
    email: "clear",
    url: "clear",
    duration: "clear",
    currency: "clear",
    json: "clear",
    checkbox: "clear",
    longText: "cast",
    reference: "disabled",
    rollup: "ignore",
    rating: "ignore",
    attachment: "clear",
    button: "ignore",
    percentage: "clear",
    formula: "ignore",
    dateRange: "clear",
  },
  attachment: {
    string: "cast",
    number: "clear",
    select: "clear",
    user: "clear",
    date: "clear",
    email: "clear",
    url: "clear",
    duration: "clear",
    currency: "clear",
    json: "clear",
    checkbox: "clear",
    longText: "cast",
    reference: "disabled",
    rollup: "ignore",
    rating: "clear",
    attachment: "ignore",
    button: "ignore",
    percentage: "clear",
    formula: "ignore",
    dateRange: "clear",
  },
  button: {
    string: "ignore",
    number: "ignore",
    select: "ignore",
    user: "ignore",
    date: "ignore",
    email: "ignore",
    url: "ignore",
    duration: "ignore",
    currency: "ignore",
    json: "ignore",
    checkbox: "ignore",
    longText: "ignore",
    reference: "ignore",
    rollup: "ignore",
    rating: "ignore",
    attachment: "ignore",
    button: "ignore",
    percentage: "ignore",
    formula: "ignore",
    dateRange: "ignore",
  },
  percentage: {
    string: "cast",
    number: "cast",
    select: "clear",
    user: "clear",
    date: "clear",
    email: "clear",
    url: "clear",
    duration: "clear",
    currency: "cast",
    json: "clear",
    checkbox: "clear",
    longText: "cast",
    reference: "disabled",
    rollup: "ignore",
    rating: "clear",
    attachment: "clear",
    button: "ignore",
    percentage: "ignore",
    formula: "ignore",
    dateRange: "clear",
  },
  formula: {
    string: "ignore",
    number: "ignore",
    select: "ignore",
    user: "ignore",
    date: "ignore",
    email: "ignore",
    url: "ignore",
    duration: "ignore",
    currency: "ignore",
    json: "ignore",
    checkbox: "ignore",
    longText: "ignore",
    reference: "ignore",
    rollup: "ignore",
    rating: "ignore",
    attachment: "ignore",
    button: "ignore",
    percentage: "ignore",
    formula: "ignore",
    dateRange: "ignore",
  },
  dateRange: {
    string: "cast",
    number: "clear",
    select: "clear",
    user: "clear",
    date: "cast",
    email: "clear",
    url: "clear",
    duration: "clear",
    currency: "clear",
    json: "clear",
    checkbox: "clear",
    longText: "cast",
    reference: "disabled",
    rollup: "ignore",
    rating: "clear",
    attachment: "clear",
    button: "ignore",
    percentage: "clear",
    formula: "ignore",
    dateRange: "ignore",
  },
}

export function getIsFieldCanCastTo(sourceType: NoneSystemFieldType, targetType: NoneSystemFieldType) {
  return changeTypeStrategies[sourceType]?.[targetType] !== "disabled" && sourceType !== targetType
}

export function getIsFieldChangeTypeDisabled(type: NoneSystemFieldType) {
  return Object.values(changeTypeStrategies[type] ?? {}).every((strategy) => strategy === "disabled")
}

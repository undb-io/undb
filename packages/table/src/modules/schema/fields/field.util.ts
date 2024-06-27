import { P, match } from "ts-pattern"
import type { IInferCreateFieldDTO } from "./dto/field.dto"
import type { FieldType, NoneSystemFieldType, SystemFieldType } from "./field.type"
import type { IRollupFn } from "./variants"

export const inferCreateFieldType = (values: (string | number | null | object | boolean)[]): IInferCreateFieldDTO => {
  return match(values)
    .returnType<IInferCreateFieldDTO>()
    .with(P.array(P.string), () => ({ type: "string" }))
    .with(P.array(P.number), () => ({ type: "number" }))
    .with(P.array(P.string.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)), () => ({ type: "email" }))
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

export const fieldsCanBeRollup: FieldType[] = ["number", "string", "rating", "email", "date"] as const

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

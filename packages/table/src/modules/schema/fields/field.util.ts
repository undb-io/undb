import { P, match } from "ts-pattern"
import type { IInferCreateFieldDTO } from "./dto/field.dto"
import type { FieldType, NoneSystemFieldType, SystemFieldType } from "./field.type"

export const inferCreateFieldType = (values: (string | number | null | object | boolean)[]): IInferCreateFieldDTO => {
  return match(values)
    .returnType<IInferCreateFieldDTO>()
    .with(P.array(P.string), () => ({ type: "string" }))
    .with(P.array(P.number), () => ({ type: "number" }))
    .otherwise(() => ({ type: "string" }))
}

const sortableFieldTypes: FieldType[] = [
  "string",
  "id",
  "createdAt",
  "updatedAt",
  "autoIncrement",
  "createdBy",
] as const

export function isFieldSortable(type: FieldType): boolean {
  return sortableFieldTypes.includes(type)
}

const systemFieldTyeps: Set<FieldType> = new Set(["id", "createdAt", "createdBy", "updatedAt", "autoIncrement"])
export function getIsSystemFieldType(type: FieldType): type is SystemFieldType {
  return systemFieldTyeps.has(type)
}

export const fieldTypes: NoneSystemFieldType[] = ["string", "number", "reference"] as const
export const systemFieldTypes: SystemFieldType[] = [
  "id",
  "autoIncrement",
  "createdAt",
  "createdBy",
  "updatedAt",
  "updatedBy",
] as const

export const allFieldTypes: FieldType[] = [...systemFieldTypes, ...fieldTypes] as const

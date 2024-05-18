import { P, match } from "ts-pattern"
import type { FieldType, IInferCreateFieldDTO } from "./field.type"

export const inferCreateFieldType = (values: (string | number | null | object | boolean)[]): IInferCreateFieldDTO => {
  return match(values)
    .returnType<IInferCreateFieldDTO>()
    .with(P.array(P.string), () => ({ type: "string" }))
    .with(P.array(P.number), () => ({ type: "number" }))
    .otherwise(() => ({ type: "string" }))
}

const sortableFieldTypes: FieldType[] = ["string", "id", "createdAt", "updatedAt", "autoIncrement"] as const

export function isFieldSortable(type: FieldType): boolean {
  return sortableFieldTypes.includes(type)
}

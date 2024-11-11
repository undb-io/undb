import { z } from "@undb/zod"

export const dateFieldMacroSchema = z.enum(["@now", "@today", "@yesterday", "@tomorrow"])

export const dateFieldMacros = dateFieldMacroSchema.options

export type IDateFieldMacro = z.infer<typeof dateFieldMacroSchema>

export function isDateFieldMacro(value: string): value is IDateFieldMacro {
  return dateFieldMacros.includes(value as any)
}

import { z } from "@undb/zod"

export const userFieldMacroSchema = z.enum(["@me"])

export const userFieldMacros = userFieldMacroSchema.options

export type IUserFieldMacro = z.infer<typeof userFieldMacroSchema>

export function isUserFieldMacro(value: string): value is IUserFieldMacro {
  return userFieldMacros.includes(value as any)
}

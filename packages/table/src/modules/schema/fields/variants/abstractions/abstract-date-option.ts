import { z } from "@undb/zod"

export const format = z.enum(["yyyy-MM-dd", "yyyy/MM/dd", "dd-MM-yyyy", "dd/MM/yyyy"])
export const formatItems = format.options

export const timeFormat = z.enum(["HH:mm", "HH:mm:ss"])
export const timeFormatItems = timeFormat.options

export const abstractDateOption = z.object({
  format: format.optional(),
  timeFormat: timeFormat.optional(),
})

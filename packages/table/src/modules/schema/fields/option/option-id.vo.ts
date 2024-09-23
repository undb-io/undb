import { IdFactory } from "@undb/domain"
import { z } from "@undb/zod"

const prefix = "opt"
const size = 6

export const optionId = z.string().startsWith(prefix).or(z.string())
export type IOptionId = z.infer<typeof optionId>

export const OptionIdVo = IdFactory(prefix, size, optionId)

export type OptionId = InstanceType<typeof OptionIdVo>

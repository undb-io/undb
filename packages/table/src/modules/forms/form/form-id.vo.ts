import { IdFactory } from "@undb/domain"
import { z } from "@undb/zod"

const prefix = "frm"

const size = 5

export const formId = z.string().startsWith(prefix)

export const FormIdVO = IdFactory(prefix, size)

export type FormId = InstanceType<typeof FormIdVO>

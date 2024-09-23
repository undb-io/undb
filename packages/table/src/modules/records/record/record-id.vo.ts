import { IdFactory } from "@undb/domain"
import { z } from "@undb/zod"

const prefix = "rec"

const size = 8

export const recordId = z.string().startsWith(prefix).or(z.string())

export const RecordIdVO = IdFactory(prefix, size)

export type RecordId = InstanceType<typeof RecordIdVO>

import { IdFactory } from "@undb/domain"
import { z } from "@undb/zod"

const prefix = "rls"

const size = 5

export const rlsId = z.string().startsWith(prefix)

export const RLSIdVO = IdFactory(prefix, size)

export type RLSId = InstanceType<typeof RLSIdVO>

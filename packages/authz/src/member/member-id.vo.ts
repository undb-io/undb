import { IdFactory } from "@undb/domain"
import { z } from "@undb/zod"

const prefix = "mem"

const size = 8

export const memberId = z.string().startsWith(prefix)

export const MemberIdVO = IdFactory(prefix, size)

export type MemberId = InstanceType<typeof MemberIdVO>

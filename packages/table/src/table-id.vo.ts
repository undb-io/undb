import { IdFactory } from "@undb/domain"
import { z } from "@undb/zod"

const prefix = "tbl"
const size = 10

export const tableId = z.string().startsWith(prefix)

export const TableIdVo = IdFactory(prefix, size, tableId)

export type TableId = InstanceType<typeof TableIdVo>

import { IdFactory } from "@undb/domain"
import { z } from "@undb/zod"

const prefix = "viw"
const size = 6

export const viewId = z.string().startsWith(prefix)
export type IViewId = z.infer<typeof viewId>

export const ViewIdVo = IdFactory(prefix, size, viewId)

export type ViewId = InstanceType<typeof ViewIdVo>

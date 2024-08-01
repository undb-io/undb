import { tableId } from "@undb/table"
import { z } from "@undb/zod"

export const getWebhooksDTO = z.object({
  tableId: tableId,
})

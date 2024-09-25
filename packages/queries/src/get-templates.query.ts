import { Query } from "@undb/domain"
import { z } from "@undb/zod"

export const getTemplatesQuery = z.object({})

export type IGetTemplatesQuery = z.infer<typeof getTemplatesQuery>

export class GetTemplatesQuery extends Query {}

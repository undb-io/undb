import { Query } from "@undb/domain"
import { templateDTO } from "@undb/template"
import { z } from "@undb/zod"

export const getTemplatesQuery = z.object({})

export type IGetTemplatesQuery = z.infer<typeof getTemplatesQuery>

export const getTemplatesQueryOutput = templateDTO.array()

export type IGetTemplatesQueryOutput = z.infer<typeof getTemplatesQueryOutput>

export class GetTemplatesQuery extends Query {}

import { Query, type QueryProps } from "@undb/domain"
import { getTemplateDTO, templateDTO } from "@undb/template"
import { z } from "@undb/zod"

export const getTemplateQuery = getTemplateDTO

export type IGetTemplateQuery = z.infer<typeof getTemplateQuery>

export const getTemplateOutput = templateDTO

export type IGetTemplateOutput = z.infer<typeof getTemplateOutput>

export class GetTemplateQuery extends Query implements IGetTemplateQuery {
  public readonly id: string
  constructor(props: QueryProps<IGetTemplateQuery>) {
    super()

    this.id = props.id
  }
}

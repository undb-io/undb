import { Query, type QueryProps } from "@undb/domain"
import { getWebhooksDTO, webhookDTO } from "@undb/webhook"
import { z } from "@undb/zod"

export const getWebhooksQuery = getWebhooksDTO

export type IGetWebhooksQuery = z.infer<typeof getWebhooksQuery>

export const getWebhooksOutput = z.object({
  webhooks: webhookDTO.array(),
})

export type IGetWebhooksOutput = z.infer<typeof getWebhooksOutput>

export class GetWebhooksQuery extends Query implements IGetWebhooksQuery {
  public readonly tableId: string

  constructor(props: QueryProps<IGetWebhooksQuery>) {
    super()
    this.tableId = props.tableId
  }
}

import { injectContext, type IContext } from "@undb/context"
import { inject, singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import { type IWebhookRepository, type WebhookDo, type WebhookSpecification } from "@undb/webhook"
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"
import { WebhookFilterVisitor } from "./webhook.filter-visitor"
import { WebhookMapper } from "./webhook.mapper"
import { WebhookMutationVisitor } from "./webhook.mutation-visitor"

@singleton()
export class WebhookRepository implements IWebhookRepository {
  constructor(
    @inject(WebhookMapper)
    private readonly mapper: WebhookMapper,
    @injectContext()
    private readonly context: IContext,
    @injectTxCTX()
    private readonly txContext: ITxContext,
  ) {}

  async findOneById(id: string): Promise<Option<WebhookDo>> {
    const wb = await this.txContext
      .getCurrentTransaction()
      .selectFrom("undb_webhook")
      .selectAll()
      .where((eb) => eb.eb("id", "=", id))
      .executeTakeFirst()

    return wb ? Some(this.mapper.toDo(wb)) : None
  }

  findOne(spec: WebhookSpecification): Promise<Option<WebhookDo>> {
    throw new Error("Method not implemented.")
  }

  async find(spec: WebhookSpecification): Promise<WebhookDo[]> {
    const wb = await this.txContext
      .getCurrentTransaction()
      .selectFrom("undb_webhook")
      .selectAll()
      .where((eb) => {
        const visitor = new WebhookFilterVisitor(eb, this.context.mustGetCurrentSpaceId())
        spec.accept(visitor)
        return visitor.cond
      })
      .execute()

    return wb.map((w) => this.mapper.toDo(w))
  }

  async insert(webhook: WebhookDo): Promise<void> {
    const values = this.mapper.toEntity(webhook)

    await this.txContext.getCurrentTransaction().insertInto("undb_webhook").values(values).execute()
  }

  async updateOneById(webhook: WebhookDo, spec: WebhookSpecification): Promise<void> {
    const visitor = new WebhookMutationVisitor()
    spec.accept(visitor)

    await this.txContext
      .getCurrentTransaction()
      .updateTable("undb_webhook")
      .set(visitor.data)
      .where((eb) => eb.eb("id", "=", webhook.id.value))
      .execute()
  }

  async deleteOneById(id: string): Promise<void> {
    await this.txContext.getCurrentTransaction().deleteFrom("undb_webhook").where("undb_webhook.id", "=", id).execute()
  }
}

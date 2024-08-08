import { inject, singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import { type IWebhookRepository, type WebhookDo, type WebhookSpecification } from "@undb/webhook"
import { getCurrentTransaction } from "../ctx"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { WebhookFilterVisitor } from "./webhook.filter-visitor"
import { WebhookMapper } from "./webhook.mapper"
import { WebhookMutationVisitor } from "./webhook.mutation-visitor"

@singleton()
export class WebhookRepository implements IWebhookRepository {
  constructor(
    @inject(WebhookMapper)
    private readonly mapper: WebhookMapper,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  async findOneById(id: string): Promise<Option<WebhookDo>> {
    const wb = await (getCurrentTransaction() ?? this.qb)
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
    const wb = await (getCurrentTransaction() ?? this.qb)
      .selectFrom("undb_webhook")
      .selectAll()
      .where((eb) => {
        const visitor = new WebhookFilterVisitor(eb)
        spec.accept(visitor)
        return visitor.cond
      })
      .execute()

    return wb.map((w) => this.mapper.toDo(w))
  }

  async insert(webhook: WebhookDo): Promise<void> {
    const values = this.mapper.toEntity(webhook)

    await (getCurrentTransaction() ?? this.qb).insertInto("undb_webhook").values(values).execute()
  }

  async updateOneById(webhook: WebhookDo, spec: WebhookSpecification): Promise<void> {
    const visitor = new WebhookMutationVisitor()
    spec.accept(visitor)

    await (getCurrentTransaction() ?? this.qb)
      .updateTable("undb_webhook")
      .set(visitor.data)
      .where((eb) => eb.eb("id", "=", webhook.id.value))
      .execute()
  }

  deleteOneById(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

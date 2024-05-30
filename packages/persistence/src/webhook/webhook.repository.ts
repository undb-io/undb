import { None, Some, type IUnitOfWork, type Option } from "@undb/domain"
import { WithWebhookId, type IWebhookRepository, type WebhookDo, type WebhookSpecification } from "@undb/webhook"
import { webhook } from "../tables"
import { inject, singleton } from "@undb/di"
import { WebhookMapper } from "./webhook.mapper"
import { injectDbUnitOfWork } from "../uow"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { WebhookFilterVisitor } from "./webhook.filter-visitor"

@singleton()
export class WebhookRepository implements IWebhookRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @inject(WebhookMapper)
    private readonly mapper: WebhookMapper,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
  ) {}

  async findOneById(id: string): Promise<Option<WebhookDo>> {
    const qb = this.db.select().from(webhook).$dynamic()

    const spec = WithWebhookId.fromString(id)
    const visitor = new WebhookFilterVisitor()
    spec.accept(visitor)

    const wb = await qb.where(visitor.cond).limit(1)

    return wb.length ? Some(this.mapper.toDo(wb[0])) : None
  }
  findOne(spec: WebhookSpecification): Promise<Option<WebhookDo>> {
    throw new Error("Method not implemented.")
  }
  find(spec: WebhookSpecification): Promise<WebhookDo[]> {
    throw new Error("Method not implemented.")
  }
  insert(webhook: WebhookDo): Promise<void> {
    throw new Error("Method not implemented.")
  }
  updateOneById(id: string, spec: WebhookSpecification): Promise<void> {
    throw new Error("Method not implemented.")
  }
  deleteOneById(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

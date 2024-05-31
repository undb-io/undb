import { inject, singleton } from "@undb/di"
import type { IPagination, IUnitOfWork, Option } from "@undb/domain"
import type { IWebhookDTO, IWebhookQueryRepository, WebhookSpecification } from "@undb/webhook"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { webhook } from "../tables"
import { injectDbUnitOfWork } from "../uow"
import { WebhookFilterVisitor } from "./webhook.filter-visitor"
import { WebhookMapper } from "./webhook.mapper"

@singleton()
export class WebhookQueryRepository implements IWebhookQueryRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @inject(WebhookMapper)
    private readonly mapper: WebhookMapper,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
  ) {}

  async find(spec: Option<WebhookSpecification>, pagination: Option<IPagination>): Promise<IWebhookDTO[]> {
    const qb = this.db.select().from(webhook).$dynamic()
    const visitor = new WebhookFilterVisitor()

    if (spec.isSome()) {
      spec.unwrap().accept(visitor)
    }

    const wbs = await qb.where(visitor.cond)

    return wbs.map(this.mapper.toDTO)
  }
}

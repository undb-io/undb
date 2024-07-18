import type { IShareSpecVisitor, Share, WithShareEnabled, WithShareForm, WithShareId, WithShareView } from "@undb/share"
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"

export class ShareFilterVisitor extends AbstractQBVisitor<Share> implements IShareSpecVisitor {
  constructor(protected readonly eb: ExpressionBuilder<Database, "undb_share">) {
    super(eb)
  }
  idEqual(s: WithShareId): void {
    this.addCond(this.eb.eb("id", "=", s.shareId.value))
  }
  targetView(s: WithShareView): void {
    const cond = this.eb.and([this.eb.eb("target_type", "=", "view"), this.eb.eb("target_id", "=", s.viewId)])
    this.addCond(cond)
  }
  targetForm(s: WithShareForm): void {
    const cond = this.eb.and([this.eb.eb("target_type", "=", "form"), this.eb.eb("target_id", "=", s.formId)])
    this.addCond(cond)
  }
  enabled(s: WithShareEnabled): void {
    const cond = this.eb.eb("enabled", "=", s.enabled)
    this.addCond(cond)
  }
}

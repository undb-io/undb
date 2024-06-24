import type { IShareSpecVisitor, Share, WithShareEnabled, WithShareForm, WithShareId, WithShareView } from "@undb/share"
import { and, eq } from "drizzle-orm"
import { AbstractDBFilterVisitor } from "../abstract-db.visitor"
import { shareTable } from "../tables"

export class ShareFilterVisitor extends AbstractDBFilterVisitor<Share> implements IShareSpecVisitor {
  idEqual(s: WithShareId): void {
    throw new Error("Method not implemented.")
  }
  targetView(s: WithShareView): void {
    this.addCond(and(eq(shareTable.targetType, "view"), eq(shareTable.targetId, s.viewId)))
  }
  targetForm(s: WithShareForm): void {
    this.addCond(and(eq(shareTable.targetType, "form"), eq(shareTable.targetId, s.formId)))
  }
  enabled(s: WithShareEnabled): void {
    throw new Error("Method not implemented.")
  }
}

import { CompositeSpecification } from "@undb/domain"
import type { Result } from "oxide.ts"
import { Ok } from "oxide.ts"
import { match } from "ts-pattern"
import { ShareTarget, type IShareType } from "../share-target.vo.js"
import type { Share } from "../share.js"
import type { IShareSpecVisitor } from "./interface.js"

export class WithShareView extends CompositeSpecification<Share, IShareSpecVisitor> {
  constructor(public readonly viewId: string) {
    super()
  }

  isSatisfiedBy(s: Share): boolean {
    throw new Error("Method not implemented.")
  }

  mutate(w: Share): Result<Share, string> {
    w.target = new ShareTarget({ type: "view", id: this.viewId })
    return Ok(w)
  }

  accept(v: IShareSpecVisitor): Result<void, string> {
    v.targetView(this)
    return Ok(undefined)
  }
}

export class WithShareForm extends CompositeSpecification<Share, IShareSpecVisitor> {
  constructor(public readonly formId: string) {
    super()
  }

  isSatisfiedBy(s: Share): boolean {
    throw new Error("Method not implemented.")
  }

  mutate(w: Share): Result<Share, string> {
    w.target = new ShareTarget({ type: "form", id: this.formId })
    return Ok(w)
  }

  accept(v: IShareSpecVisitor): Result<void, string> {
    v.targetForm(this)
    return Ok(undefined)
  }
}

export class WithShareTable extends CompositeSpecification<Share, IShareSpecVisitor> {
  constructor(public readonly tableId: string) {
    super()
  }

  isSatisfiedBy(s: Share): boolean {
    return s.target.type === "table" && s.target.id === this.tableId
  }

  mutate(w: Share): Result<Share, string> {
    w.target = new ShareTarget({ type: "table", id: this.tableId })
    return Ok(w)
  }

  accept(v: IShareSpecVisitor): Result<void, string> {
    v.targetTable(this)
    return Ok(undefined)
  }
}

export class WithShareBase extends CompositeSpecification<Share, IShareSpecVisitor> {
  constructor(public readonly baseId: string) {
    super()
  }

  isSatisfiedBy(s: Share): boolean {
    return s.target.type === "base" && s.target.id === this.baseId
  }

  mutate(w: Share): Result<Share, string> {
    w.target = new ShareTarget({ type: "base", id: this.baseId })
    return Ok(w)
  }

  accept(v: IShareSpecVisitor): Result<void, string> {
    v.targetBase(this)
    return Ok(undefined)
  }
}

export class WithShareDashboard extends CompositeSpecification<Share, IShareSpecVisitor> {
  constructor(public readonly dashboardId: string) {
    super()
  }

  isSatisfiedBy(s: Share): boolean {
    return s.target.type === "dashboard" && s.target.id === this.dashboardId
  }

  mutate(w: Share): Result<Share, string> {
    w.target = new ShareTarget({ type: "dashboard", id: this.dashboardId })
    return Ok(w)
  }

  accept(v: IShareSpecVisitor): Result<void, string> {
    v.targetDashboard(this)
    return Ok(undefined)
  }
}

export const withShare = (type: IShareType | undefined, id: string) => {
  return match(type)
    .with("view", undefined, () => new WithShareView(id))
    .with("form", () => new WithShareForm(id))
    .with("table", () => new WithShareTable(id))
    .with("base", () => new WithShareBase(id))
    .with("dashboard", () => new WithShareDashboard(id))
    .exhaustive()
}

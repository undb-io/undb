import { CompositeSpecification, Ok, Option, Result } from "@undb/domain"
import type { Audit } from "../audit"
import type { IAuditSpecVisitor } from "./interface"

export class WithAuditMetaSpec extends CompositeSpecification<Audit, IAuditSpecVisitor> {
  constructor(public readonly meta: Record<string, unknown>) {
    super()
  }
  isSatisfiedBy(t: Audit): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: Audit): Result<Audit, string> {
    t.meta = Option(this.meta)
    return Ok(t)
  }
  accept(v: IAuditSpecVisitor): Result<void, string> {
    throw new Error("Method not implemented.")
  }
}

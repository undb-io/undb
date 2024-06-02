import { CompositeSpecification } from "@undb/domain"
import { TableIdVo, type TableId } from "@undb/table"
import { Ok, type Result } from "oxide.ts"
import type { Audit } from "../audit.js"
import type { IAuditSpecVisitor } from "./interface.js"

export class WithAuditTableId extends CompositeSpecification<Audit, IAuditSpecVisitor> {
  constructor(public readonly detail: TableId) {
    super()
  }

  public static from(tableId: string) {
    return new this(new TableIdVo(tableId))
  }

  isSatisfiedBy(t: Audit): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: Audit): Result<Audit, string> {
    t.tableId = this.detail
    return Ok(t)
  }
  accept(v: IAuditSpecVisitor): Result<void, string> {
    v.tableIdEqual(this)
    return Ok(undefined)
  }
}

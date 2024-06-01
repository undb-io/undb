import { ValueObject } from "@undb/domain"
import type { TableRSL } from "./table-rls.vo"

export class TableRLSGroup extends ValueObject<TableRSL[]> {
  toJSON() {
    return this.value.map((rsl) => rsl.toJSON())
  }
}

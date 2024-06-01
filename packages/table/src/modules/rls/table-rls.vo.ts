import { ValueObject } from "@undb/domain"
import type { TableRLSAction } from "./table-rls-action.vo"
import type { TableRLSCondition } from "./table-rls-condition.vo"

export interface ITableRLS {
  action: TableRLSAction
  conditon: TableRLSCondition
}

export class TableRSL extends ValueObject<ITableRLS> {
  toJSON() {
    return {
      action: this.value.action.value,
      condition: this.value.conditon.toJSON(),
    }
  }
}

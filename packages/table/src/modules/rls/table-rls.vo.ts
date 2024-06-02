import { ValueObject } from "@undb/domain"
import type { IRLSDTO } from "./dto"
import { TableRLSAction } from "./table-rls-action.vo"
import { TableRLSCondition } from "./table-rls-condition.vo"

export interface ITableRLS {
  action: TableRLSAction
  condition: TableRLSCondition
}

export class TableRSL extends ValueObject<ITableRLS> {
  static fromJSON(dto: IRLSDTO): TableRSL {
    return new TableRSL({
      action: new TableRLSAction(dto.action),
      condition: new TableRLSCondition(dto.condition),
    })
  }

  toJSON() {
    return {
      action: this.value.action.value,
      condition: this.value.condition.toJSON(),
    }
  }
}

import { ValueObject } from "@undb/domain"
import type { IRLSDTO } from "./dto"
import { TableRLSAction } from "./table-rls-action.vo"
import { TableRLSCondition } from "./table-rls-condition.vo"
import { RLSIdVO, type RLSId } from "./table-rls-id.vo"
import { TableRLSSubject } from "./table-rls-subject.vo"

export interface ITableRLS {
  id: RLSId
  action: TableRLSAction
  subject: TableRLSSubject
  condition: TableRLSCondition
}

export class TableRLS extends ValueObject<ITableRLS> {
  public get id() {
    return this.props.id
  }

  static fromJSON(dto: IRLSDTO): TableRLS {
    return new TableRLS({
      id: new RLSIdVO(dto.id),
      action: new TableRLSAction(dto.action),
      subject: new TableRLSSubject(dto.subject),
      condition: new TableRLSCondition(dto.condition),
    })
  }

  toJSON(): IRLSDTO {
    return {
      id: this.value.id.value,
      action: this.value.action.value,
      subject: this.value.subject.value,
      condition: this.value.condition.toJSON(),
    }
  }
}

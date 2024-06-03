import { None, Option, Some, ValueObject } from "@undb/domain"
import type { IRLSDTO } from "./dto"
import { TableRLSAction } from "./table-rls-action.vo"
import { TableRLSCondition } from "./table-rls-condition.vo"
import { RLSIdVO, type RLSId } from "./table-rls-id.vo"
import { TableRLSSubject } from "./table-rls-subject.vo"

export interface ITableRLS {
  id: RLSId
  subject: TableRLSSubject
  allow: boolean
  action: TableRLSAction
  condition: Option<TableRLSCondition>
}

export class TableRLS extends ValueObject<ITableRLS> {
  public get id() {
    return this.props.id
  }

  static fromJSON(dto: IRLSDTO): TableRLS {
    return new TableRLS({
      id: new RLSIdVO(dto.id),
      action: new TableRLSAction(dto.action),
      allow: dto.allow,
      subject: new TableRLSSubject(dto.subject),
      condition: dto.condition ? Some(new TableRLSCondition(dto.condition)) : None,
    })
  }

  toJSON(): IRLSDTO {
    return {
      id: this.value.id.value,
      action: this.value.action.value,
      allow: this.value.allow,
      subject: this.value.subject.value,
      condition: this.value.condition.into(undefined)?.toJSON(),
    }
  }
}

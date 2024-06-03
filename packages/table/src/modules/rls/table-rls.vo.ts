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
  updateCondition: Option<TableRLSCondition>
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
      updateCondition: dto.updateCondition ? Some(new TableRLSCondition(dto.updateCondition)) : None,
    })
  }

  toJSON(): IRLSDTO {
    return {
      id: this.props.id.value,
      action: this.props.action.value,
      allow: this.props.allow,
      subject: this.props.subject.value,
      condition: this.props.condition.into(undefined)?.toJSON(),
      updateCondition: this.props.updateCondition.into(undefined)?.toJSON(),
    }
  }
}

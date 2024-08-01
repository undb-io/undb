import { None, Option, Some, ValueObject } from "@undb/domain"
import type { RecordComositeSpecification } from "../records/record/record.composite-specification"
import { conditionWithoutFields } from "../schema/fields/condition"
import type { Field } from "../schema/fields/field.type"
import type { Schema } from "../schema/schema.vo"
import type { IRLSDTO } from "./dto"
import { TableRLSAction, type ITableRLSActionSchema } from "./table-rls-action.vo"
import { TableRLSCondition } from "./table-rls-condition.vo"
import { RLSIdVO, type RLSId } from "./table-rls-id.vo"
import { TableRLSSubject } from "./table-rls-subject.vo"

export interface ITableRLS {
  id: RLSId
  // TODO: value object
  name: string
  enabled: boolean
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

  public get name() {
    return this.props.name
  }

  public get enabled() {
    return this.props.enabled
  }

  public set enabled(enabled: boolean) {
    this.props.enabled = enabled
  }

  public get subject() {
    return this.props.subject
  }

  public get allow() {
    return this.props.allow
  }

  public get action() {
    return this.props.action
  }

  public get condition() {
    return this.props.condition
  }

  public get updateCondition() {
    return this.props.updateCondition
  }

  private getIsUserMatch(userId: string): boolean {
    // TODO: implement
    return true
  }

  private getIsActionMatch(action: ITableRLSActionSchema): boolean {
    return this.props.action.value === action
  }

  public getSpec(schema: Schema, action: ITableRLSActionSchema, userId: string): Option<RecordComositeSpecification> {
    if (!this.getIsUserMatch(userId)) {
      return None
    }
    if (!this.props.enabled) {
      return None
    }
    if (!this.getIsActionMatch(action)) {
      return None
    }

    const spec = this.condition.map((c) => c.getSpec(schema) as Option<RecordComositeSpecification>).flatten()
    if (!this.props.allow && spec.isSome()) {
      return Some(spec.unwrap().not() as unknown as RecordComositeSpecification)
    }

    return spec
  }

  public deleteField(field: Field): TableRLS {
    if (this.props.condition.isNone()) {
      return this
    }
    return TableRLS.fromJSON({
      ...this.toJSON(),
      condition: conditionWithoutFields(this.props.condition.unwrap().toJSON(), new Set([field.id.value])),
    })
  }

  static fromJSON(dto: IRLSDTO): TableRLS {
    return new TableRLS({
      id: new RLSIdVO(dto.id),
      name: dto.name,
      enabled: dto.enabled,
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
      name: this.props.name,
      enabled: this.props.enabled,
      action: this.props.action.value,
      allow: this.props.allow,
      subject: this.props.subject.value,
      condition: this.props.condition.into(undefined)?.toJSON(),
      updateCondition: this.props.updateCondition.into(undefined)?.toJSON(),
    }
  }
}

import { Option, Some, ValueObject, andOptions } from "@undb/domain"
import { WithTableRLS } from "../../specifications"
import type { Field, Schema } from "../schema"
import type { IRLSGroupDTO } from "./dto"
import type { ITableRLSActionSchema } from "./table-rls-action.vo"
import { TableRLS } from "./table-rls.vo"

export class TableRLSGroup extends ValueObject<TableRLS[]> {
  static fromJSON(dto: IRLSGroupDTO) {
    return new TableRLSGroup(dto.map((rls) => TableRLS.fromJSON(rls)))
  }

  getSpec(schema: Schema, action: ITableRLSActionSchema, userId: string) {
    const specs = this.props.map((rls) => rls.getSpec(schema, action, userId))
    return andOptions(...specs)
  }

  setRLS(rls: TableRLS) {
    const values = [...this.props]
    const index = values.findIndex((r) => r.id.equals(rls.id))
    if (index === -1) {
      values.push(rls)
    } else {
      values[index] = rls
    }

    return new TableRLSGroup(values)
  }

  $deleteField(field: Field): Option<WithTableRLS> {
    const previous = TableRLSGroup.fromJSON(this.toJSON())
    const newRls = new TableRLSGroup(this.props.map((rls) => rls.deleteField(field)))

    const spec = new WithTableRLS(Some(previous), Some(newRls))
    return Some(spec)
  }

  toJSON(): IRLSGroupDTO {
    return this.props.map((rls) => rls.toJSON())
  }
}

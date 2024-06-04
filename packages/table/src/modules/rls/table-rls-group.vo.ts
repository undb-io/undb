import { ValueObject, andOptions } from "@undb/domain"
import type { IRLSGroupDTO } from "./dto"
import { TableRLS } from "./table-rls.vo"
import type { Schema } from "../schema"
import type { ITableRLSActionSchema } from "./table-rls-action.vo"

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

  toJSON() {
    return this.props.map((rls) => rls.toJSON())
  }
}

import { ValueObject } from "@undb/domain"
import type { IRLSGroupDTO } from "./dto"
import { TableRLS } from "./table-rls.vo"

export class TableRLSGroup extends ValueObject<TableRLS[]> {
  static fromJSON(dto: IRLSGroupDTO) {
    return new TableRLSGroup(dto.map((rls) => TableRLS.fromJSON(rls)))
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

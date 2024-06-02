import { ValueObject } from "@undb/domain"
import type { IRLSGroupDTO } from "./dto"
import { TableRLS } from "./table-rls.vo"

export class TableRLSGroup extends ValueObject<TableRLS[]> {
  static fromJSON(dto: IRLSGroupDTO) {
    return new TableRLSGroup(dto.map((rsl) => TableRLS.fromJSON(rsl)))
  }

  setRLS(rls: TableRLS) {
    const values = [...this.value]
    const index = values.findIndex((rsl) => rsl.id.equals(rls.id))
    if (index === -1) {
      values.push(rls)
    } else {
      values[index] = rls
    }

    return new TableRLSGroup(values)
  }

  toJSON() {
    return this.value.map((rsl) => rsl.toJSON())
  }
}

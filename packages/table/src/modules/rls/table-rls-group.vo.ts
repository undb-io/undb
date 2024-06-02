import { ValueObject } from "@undb/domain"
import type { IRLSGroupDTO } from "./dto"
import { TableRSL } from "./table-rls.vo"

export class TableRLSGroup extends ValueObject<TableRSL[]> {
  static fromJSON(dto: IRLSGroupDTO) {
    return new TableRLSGroup(dto.map((rsl) => TableRSL.fromJSON(rsl)))
  }
  toJSON() {
    return this.value.map((rsl) => rsl.toJSON())
  }
}

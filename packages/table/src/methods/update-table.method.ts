import { and, None, type Option } from "@undb/domain"
import type { IUpdateTableDTO } from "../dto"
import { TableNameSpecification, type TableComositeSpecification } from "../specifications"
import { TableNameVo } from "../table-name.vo"
import type { TableDo } from "../table.do"

export function updateTable(this: TableDo, dto: IUpdateTableDTO): Option<TableComositeSpecification> {
  let specs: TableComositeSpecification[] = []
  if (dto.name) {
    specs.push(new TableNameSpecification(new TableNameVo(dto.name)))
  }

  return specs.length ? and(...specs) : None
}

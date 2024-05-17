import { NotImplementException, type Option } from "@undb/domain"
import type { ISetTableRLSDTO } from "../dto"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function setTableRLS(this: TableDo, dto: ISetTableRLSDTO): Option<TableComositeSpecification> {
  throw new NotImplementException("setTableRLS" + ".mutate")
}

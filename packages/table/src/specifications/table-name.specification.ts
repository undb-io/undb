import { Err, Ok, type Result } from "@undb/domain"
import type { IUniqueTableDTO } from "../dto"
import { TableIdVo } from "../table-id.vo"
import type { TableNameVo } from "../table-name.vo"
import type { TableDo } from "../table.do"
import { TableIdSpecification } from "./table-id.specification"
import type { ITableSpecVisitor } from "./table-visitor.interface"
import { TableComositeSpecification } from "./table.composite-specification"

export class TableNameSpecification extends TableComositeSpecification {
  constructor(public readonly name: TableNameVo) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    return t.name.equals(this.name)
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.name = this.name
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withName(this)
    return Ok(undefined)
  }
}

export class TableUniqueNameSpecification extends TableComositeSpecification {
  constructor(
    public readonly baseName: string,
    public readonly tableName: string,
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withTableUnqueName(this)
    return Ok(undefined)
  }
}

export const withUniqueTable = (dto: IUniqueTableDTO): Result<TableComositeSpecification, string> => {
  if (dto.tableId) {
    return Ok(new TableIdSpecification(new TableIdVo(dto.tableId)))
  }
  if (dto.baseName && dto.tableName) {
    return Ok(new TableUniqueNameSpecification(dto.baseName, dto.tableName))
  }

  return Err("Invalid unique table specification")
}

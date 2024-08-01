import { CompositeSpecification } from "@undb/domain"
import type { TableDo } from "../table.do"
import type { ITableSpecVisitor } from "./table-visitor.interface"

export abstract class TableComositeSpecification extends CompositeSpecification<TableDo, ITableSpecVisitor> {}

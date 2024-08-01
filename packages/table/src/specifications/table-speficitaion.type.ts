import { CompositeSpecification } from "@undb/domain"
import type { TableDo } from "../table.do"
import type { ITableSpecVisitor } from "./table-visitor.interface"

export type ITableCompositeSpecification = CompositeSpecification<TableDo, ITableSpecVisitor>

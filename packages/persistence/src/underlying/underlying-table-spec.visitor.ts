import { WontImplementException, type ISpecification, type ISpecVisitor } from "@undb/domain"
import type {
  ITableSpecVisitor,
  TableIdSpecification,
  TableNameSpecification,
  TableSchemaSpecification,
  TableViewsSpecification,
  WithNewFieldSpecification,
  WithUpdatedFieldSpecification,
  WithViewAggregate,
  WithViewColor,
  WithViewFilter,
  WithViewSort,
} from "@undb/table"
import type {
  TableFormsSpecification,
  WithFormSpecification,
  WithNewFormSpecification,
} from "@undb/table/src/specifications/table-forms.specification"
import type { WithTableRLS } from "@undb/table/src/specifications/table-rls.specification"
import { AlterTableBuilder, AlterTableColumnAlteringBuilder, CreateTableBuilder } from "kysely"
import type { IQueryBuilder } from "../qb"
import { ConversionContext } from "./conversion/conversion.context"
import { ConversionFactory } from "./conversion/conversion.factory"
import type { UnderlyingTable } from "./underlying-table"
import { UnderlyingTableFieldVisitor } from "./underlying-table-field.visitor"

export class UnderlyingTableSpecVisitor implements ITableSpecVisitor {
  private tb: AlterTableBuilder
  constructor(
    public readonly table: UnderlyingTable,
    public readonly qb: IQueryBuilder,
  ) {
    this.tb = qb.schema.alterTable(table.name)
  }

  atb: AlterTableColumnAlteringBuilder | CreateTableBuilder<any, any> | null = null

  execute() {
    this.atb?.execute()
  }

  withUpdatedField(spec: WithUpdatedFieldSpecification): void {
    const typeChanged = spec.getIsTypeChanged()
    if (!typeChanged) {
      return
    }

    const strategy = ConversionFactory.create(this.tb as AlterTableBuilder, spec.previous.type, spec.field.type)
    const context = new ConversionContext(strategy)

    context.convert(spec.field)
  }
  withForm(views: WithFormSpecification): void {}
  withForms(views: TableFormsSpecification): void {}
  withNewForm(views: WithNewFormSpecification): void {}
  withId(id: TableIdSpecification): void {}
  withName(name: TableNameSpecification): void {}
  withSchema(schema: TableSchemaSpecification): void {}
  withNewField(schema: WithNewFieldSpecification): void {
    const fieldVisitor = new UnderlyingTableFieldVisitor(this.table, this.tb)
    schema.field.accept(fieldVisitor)
    this.atb = fieldVisitor.atb
  }
  withTableRLS(rls: WithTableRLS): void {}
  withViews(views: TableViewsSpecification): void {}
  withViewFilter(viewFilter: WithViewFilter): void {}
  withViewColor(viewColor: WithViewColor): void {}
  withViewSort(viewSort: WithViewSort): void {}
  withViewAggregate(viewColor: WithViewAggregate): void {}
  and(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    left.accept(this)
    right.accept(this)
    return this
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new WontImplementException(UnderlyingTableSpecVisitor.name + ".or")
  }
  not(spec: ISpecification<any, ISpecVisitor>): this {
    throw new WontImplementException(UnderlyingTableSpecVisitor.name + ".not")
  }
  clone(): this {
    return this
  }
}

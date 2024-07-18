import { NotImplementException, WontImplementException } from "@undb/domain"
import type {
  ITableSpecVisitor,
  TableBaseIdSpecification,
  TableDo,
  TableFormsSpecification,
  TableIdSpecification,
  TableIdsSpecification,
  TableNameSpecification,
  TableSchemaSpecification,
  TableViewsSpecification,
  WithDuplicatedFieldSpecification,
  WithForeignRollupFieldSpec,
  WithFormIdSpecification,
  WithFormSpecification,
  WithNewFieldSpecification,
  WithNewFormSpecification,
  WithNewView,
  WithTableRLS,
  WithUpdatedFieldSpecification,
  WithView,
  WithViewAggregate,
  WithViewColor,
  WithViewFields,
  WithViewFilter,
  WithViewIdSpecification,
  WithViewOption,
  WithViewSort,
  WithoutFieldSpecification,
  WithoutView,
} from "@undb/table"
import { eq, or } from "drizzle-orm"
import { AbstractDBMutationVisitor } from "../abstract-db.visitor"
import { AbstractQBMutationVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"
import type { IQueryBuilder } from "../qb"
import { rollupIdMapping, tableIdMapping, tables } from "../tables"

export class TableMutationVisitor
  extends AbstractDBMutationVisitor<TableDo, typeof tables>
  implements ITableSpecVisitor
{
  constructor(
    public readonly table: TableDo,
    db: Database,
  ) {
    super(db)
  }
  withViewId(spec: WithViewIdSpecification): void {
    throw new Error("Method not implemented.")
  }
  withFormId(spec: WithFormIdSpecification): void {
    throw new Error("Method not implemented.")
  }
  withForeignRollupField(spec: WithForeignRollupFieldSpec): void {
    throw new Error("Method not implemented.")
  }
  withBaseId(id: TableBaseIdSpecification): void {
    this.addUpdates({ baseId: id.baseId })
  }
  withView(views: WithView): void {
    this.addUpdates({ views: this.table.views?.toJSON() })
  }
  withoutView(view: WithoutView): void {
    this.addUpdates({ views: this.table.views?.toJSON() })
  }
  withNewView(views: WithNewView): void {
    this.addUpdates({ views: this.table.views?.toJSON() })
    const insert = this.db
      .insert(tableIdMapping)
      .values({ tableId: this.table.id.value, subjectId: views.view.id.value })
    this.addSql(insert)
  }
  withViewOption(viewOption: WithViewOption): void {
    this.addUpdates({ views: this.table.views?.toJSON() })
  }
  withViewFields(fields: WithViewFields): void {
    this.addUpdates({ views: this.table.views?.toJSON() })
  }
  withUpdatedField(spec: WithUpdatedFieldSpecification): void {
    this.addUpdates({ schema: this.table.schema?.toJSON() })
  }

  withForm(views: WithFormSpecification): void {
    this.addUpdates({ forms: this.table.forms?.toJSON() })
  }
  withForms(forms: TableFormsSpecification): void {
    this.addUpdates({ forms: this.table.forms?.toJSON() })
  }
  withNewForm(form: WithNewFormSpecification): void {
    this.addUpdates({ forms: this.table.forms?.toJSON() })
    const insert = this.db.insert(tableIdMapping).values({ tableId: this.table.id.value, subjectId: form.form.id })
    this.addSql(insert)
  }
  withNewField(schema: WithNewFieldSpecification): void {
    const field = schema.field

    this.addUpdates({ schema: this.table.schema?.toJSON() })
    const insert = this.db.insert(tableIdMapping).values({ tableId: this.table.id.value, subjectId: field.id.value })
    this.addSql(insert)

    if (field.type === "rollup") {
      const referenceField = field.getReferenceField(this.table)
      const option = field.option.unwrap()
      const insertRollup = this.db
        .insert(rollupIdMapping)
        .values({
          fieldId: option.rollupFieldId,
          tableId: referenceField.foreignTableId,
          rollupId: field.id.value,
          rollupTableId: this.table.id.value,
        })
        .onConflictDoNothing()
      this.addSql(insertRollup)
    }
  }
  withDuplicateField(schema: WithDuplicatedFieldSpecification): void {}
  withoutField(schema: WithoutFieldSpecification): void {
    this.addUpdates({ schema: this.table.schema?.toJSON() })

    const deleteQuery = this.db.delete(tableIdMapping).where(eq(tableIdMapping.subjectId, schema.field.id.value))
    this.addSql(deleteQuery)

    const deleteRollup = this.db
      .delete(rollupIdMapping)
      .where(
        or(eq(rollupIdMapping.fieldId, schema.field.id.value), eq(rollupIdMapping.rollupId, schema.field.id.value)),
      )
    this.addSql(deleteRollup)
  }
  withViewAggregate(viewColor: WithViewAggregate): void {
    this.addUpdates({ views: this.table.views?.toJSON() })
  }
  withTableRLS(rls: WithTableRLS): void {
    this.addUpdates({ rls: this.table.rls.into(undefined)?.toJSON() })
  }
  withViewSort(viewSort: WithViewSort): void {
    this.addUpdates({ views: this.table.views?.toJSON() })
  }
  withViewColor(viewFilter: WithViewColor): void {
    this.addUpdates({ views: this.table.views?.toJSON() })
  }
  withId(id: TableIdSpecification): void {
    throw new WontImplementException(TableMutationVisitor.name + ".withId")
  }
  withName(name: TableNameSpecification): void {
    this.addUpdates({ name: name.name.value })
  }
  withSchema(schema: TableSchemaSpecification): void {
    throw new NotImplementException(TableMutationVisitor.name + ".withSchema")
  }
  withViews(views: TableViewsSpecification): void {
    throw new NotImplementException(TableMutationVisitor.name + ".withSchema")
  }
  withViewFilter(viewFilter: WithViewFilter): void {
    this.addUpdates({ views: this.table.views?.toJSON() })
  }
  idsIn(ids: TableIdsSpecification): void {}
}

export class TableMutationVisitor2 extends AbstractQBMutationVisitor implements ITableSpecVisitor {
  constructor(
    private readonly table: TableDo,
    private readonly qb: IQueryBuilder,
  ) {
    super()
  }
  withId(id: TableIdSpecification): void {
    throw new Error("Method not implemented.")
  }
  withBaseId(id: TableBaseIdSpecification): void {
    this.setData(tables.baseId.name, id.baseId)
  }
  idsIn(ids: TableIdsSpecification): void {
    throw new Error("Method not implemented.")
  }
  withName(name: TableNameSpecification): void {
    this.setData(tables.name.name, name.name.value)
  }
  withSchema(schema: TableSchemaSpecification): void {
    throw new Error("Method not implemented.")
  }
  withNewField(schema: WithNewFieldSpecification): void {
    throw new Error("Method not implemented.")
  }
  withDuplicateField(schema: WithDuplicatedFieldSpecification): void {
    throw new Error("Method not implemented.")
  }
  withoutField(schema: WithoutFieldSpecification): void {
    throw new Error("Method not implemented.")
  }
  withUpdatedField(spec: WithUpdatedFieldSpecification): void {
    throw new Error("Method not implemented.")
  }
  withTableRLS(rls: WithTableRLS): void {
    throw new Error("Method not implemented.")
  }
  withViews(views: TableViewsSpecification): void {
    throw new Error("Method not implemented.")
  }
  withView(views: WithView): void {
    this.setData(tables.views.name, this.table.views?.toJSON())
  }
  withNewView(views: WithNewView): void {
    throw new Error("Method not implemented.")
  }
  withoutView(view: WithoutView): void {
    throw new Error("Method not implemented.")
  }
  withViewId(spec: WithViewIdSpecification): void {
    throw new Error("Method not implemented.")
  }
  withViewFilter(viewFilter: WithViewFilter): void {
    throw new Error("Method not implemented.")
  }
  withViewOption(viewOption: WithViewOption): void {
    throw new Error("Method not implemented.")
  }
  withViewColor(viewColor: WithViewColor): void {
    throw new Error("Method not implemented.")
  }
  withViewSort(viewSort: WithViewSort): void {
    throw new Error("Method not implemented.")
  }
  withViewAggregate(viewColor: WithViewAggregate): void {
    throw new Error("Method not implemented.")
  }
  withViewFields(fields: WithViewFields): void {
    throw new Error("Method not implemented.")
  }
  withForms(views: TableFormsSpecification): void {
    throw new Error("Method not implemented.")
  }
  withFormId(spec: WithFormIdSpecification): void {
    throw new Error("Method not implemented.")
  }
  withNewForm(views: WithNewFormSpecification): void {
    throw new Error("Method not implemented.")
  }
  withForm(views: WithFormSpecification): void {
    throw new Error("Method not implemented.")
  }
  withForeignRollupField(spec: WithForeignRollupFieldSpec): void {
    throw new Error("Method not implemented.")
  }
}

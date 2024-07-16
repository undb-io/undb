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
import type { Database } from "../db"
import { rollupIdMapping, tableIdMapping, type tables } from "../tables"

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
    throw new NotImplementException(TableMutationVisitor.name + ".withName")
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

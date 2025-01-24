import type {
  DuplicatedTableSpecification,
  ITableSpecVisitor,
  TableBaseIdSpecification,
  TableDo,
  TableFormsSpecification,
  TableIdSpecification,
  TableIdsSpecification,
  TableNameSpecification,
  TableSchemaSpecification,
  TableSpaceIdSpecification,
  TableUniqueNameSpecification,
  TableViewsSpecification,
  WithDuplicatedFieldSpecification,
  WithForeignRollupFieldSpec,
  WithFormIdSpecification,
  WithFormSpecification,
  WithNewFieldSpecification,
  WithNewFormSpecification,
  WithNewView,
  WithTableForeignTablesSpec,
  WithTableRLS,
  WithUpdatedFieldSpecification,
  WithView,
  WithViewAggregate,
  WithViewColor,
  WithViewFieldWidth,
  WithViewFields,
  WithViewFilter,
  WithViewIdSpecification,
  WithViewOption,
  WithViewSort,
  WithViewWidgets,
  WithoutFieldSpecification,
  WithoutFormSpecification,
  WithoutView,
} from "@undb/table"
import { AbstractQBMutationVisitor } from "../abstract-qb.visitor"
import type { IDbProvider } from "../db.provider"
import { type IQueryBuilder } from "../qb.type"
import { json } from "../qb.util"
import { tables } from "../schema/sqlite"

export class TableMutationVisitor extends AbstractQBMutationVisitor implements ITableSpecVisitor {
  constructor(
    private readonly table: TableDo,
    private readonly qb: IQueryBuilder,
    private readonly dbProvider: IDbProvider,
  ) {
    super()
  }
  withSpaceId(id: TableSpaceIdSpecification): void {
    throw new Error("Method not implemented.")
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
    const field = schema.field

    this.setData(tables.schema.name, json(this.table.schema.toJSON()))

    const sql = this.qb
      .insertInto("undb_table_id_mapping")
      .values({
        table_id: this.table.id.value,
        subject_id: field.id.value,
      })
      .$if(this.dbProvider.isMysql(), (eb) => eb.ignore())
      .$if(!this.dbProvider.isMysql(), (eb) => eb.onConflict((ob) => ob.doNothing()))
      .compile()
    this.addSql(sql)

    if (field.type === "rollup") {
      const referenceField = field.getReferenceField(this.table)
      const option = field.option.unwrap()
      const sql = this.qb
        .insertInto("undb_rollup_id_mapping")
        .values({
          field_id: option.rollupFieldId,
          table_id: referenceField.foreignTableId,
          rollup_id: field.id.value,
          rollup_table_id: this.table.id.value,
        })
        .$if(this.dbProvider.isMysql(), (eb) => eb.ignore())
        .$if(!this.dbProvider.isMysql(), (eb) => eb.onConflict((ob) => ob.doNothing()))
        .compile()
      this.addSql(sql)
    } else if (field.type === "reference") {
      const sql = this.qb
        .insertInto("undb_reference_id_mapping")
        .values({
          field_id: field.id.value,
          table_id: this.table.id.value,
          symmetric_field_id: field.symmetricFieldId ?? null,
          foreign_table_id: field.foreignTableId,
        })
        .$if(this.dbProvider.isMysql(), (eb) => eb.ignore())
        .$if(!this.dbProvider.isMysql(), (eb) => eb.onConflict((ob) => ob.doNothing()))
        .compile()

      this.addSql(sql)
    }
  }
  withDuplicateField(schema: WithDuplicatedFieldSpecification): void {
    // throw new Error("Method not implemented.")
  }
  withDuplicatedTable(spec: DuplicatedTableSpecification): void {}
  withoutField(schema: WithoutFieldSpecification): void {
    this.setData(tables.schema.name, json(this.table.schema.toJSON()))

    const deleteQuery = this.qb
      .deleteFrom("undb_table_id_mapping")
      .where((eb) => eb.eb("subject_id", "=", schema.field.id.value))
      .compile()
    this.addSql(deleteQuery)

    const deleteRollup = this.qb
      .deleteFrom("undb_rollup_id_mapping")
      .where((eb) =>
        eb.or([eb.eb("field_id", "=", schema.field.id.value), eb.eb("rollup_id", "=", schema.field.id.value)]),
      )
      .compile()
    this.addSql(deleteRollup)

    const deleteReference = this.qb
      .deleteFrom("undb_reference_id_mapping")
      .where((eb) =>
        eb.or([eb.eb("field_id", "=", schema.field.id.value), eb.eb("symmetric_field_id", "=", schema.field.id.value)]),
      )
      .compile()

    this.addSql(deleteReference)
  }
  withUpdatedField(spec: WithUpdatedFieldSpecification): void {
    this.setData(tables.schema.name, json(this.table.schema.toJSON()))
  }
  withTableRLS(rls: WithTableRLS): void {
    const data = this.table.rls?.into(undefined)

    this.setData(tables.rls.name, data ? json(data) : null)
  }
  withViews(views: TableViewsSpecification): void {
    throw new Error("Method not implemented.")
  }
  withView(views: WithView): void {
    this.setData(tables.views.name, json(this.table.views.toJSON()))
  }
  withViewFieldWidth(views: WithViewFieldWidth): void {
    this.setData(tables.views.name, json(this.table.views.toJSON()))
  }
  withNewView(views: WithNewView): void {
    this.setData(tables.views.name, json(this.table.views.toJSON()))

    const sql = this.qb
      .insertInto("undb_table_id_mapping")
      .values({
        table_id: this.table.id.value,
        subject_id: views.view.id.value,
      })
      .$if(this.dbProvider.isMysql(), (eb) => eb.ignore())
      .$if(!this.dbProvider.isMysql(), (eb) => eb.onConflict((ob) => ob.doNothing()))
      .compile()

    this.addSql(sql)
  }
  withViewWidgets(spec: WithViewWidgets): void {
    this.setData(tables.views.name, json(this.table.views.toJSON()))
  }
  withoutView(view: WithoutView): void {
    this.setData(tables.views.name, json(this.table.views.toJSON()))
    const deleteQuery = this.qb
      .deleteFrom("undb_table_id_mapping")
      .where((eb) => eb.eb("subject_id", "=", view.view.id.value))
      .compile()
    this.addSql(deleteQuery)
  }
  withViewId(spec: WithViewIdSpecification): void {
    throw new Error("Method not implemented.")
  }
  withViewFilter(viewFilter: WithViewFilter): void {
    this.setData(tables.views.name, json(this.table.views.toJSON()))
  }
  withViewOption(viewOption: WithViewOption): void {
    this.setData(tables.views.name, json(this.table.views.toJSON()))
  }
  withViewColor(viewColor: WithViewColor): void {
    this.setData(tables.views.name, json(this.table.views.toJSON()))
  }
  withViewSort(viewSort: WithViewSort): void {
    this.setData(tables.views.name, json(this.table.views.toJSON()))
  }
  withViewAggregate(viewColor: WithViewAggregate): void {
    this.setData(tables.views.name, json(this.table.views.toJSON()))
  }
  withViewFields(fields: WithViewFields): void {
    this.setData(tables.views.name, json(this.table.views.toJSON()))
  }
  withForms(views: TableFormsSpecification): void {
    this.setData(tables.forms.name, this.table.forms ? json(this.table.forms?.toJSON()) : null)
  }
  withFormId(spec: WithFormIdSpecification): void {
    throw new Error("Method not implemented.")
  }
  withNewForm(views: WithNewFormSpecification): void {
    this.setData(tables.forms.name, this.table.forms ? json(this.table.forms?.toJSON()) : null)

    const sql = this.qb
      .insertInto("undb_table_id_mapping")
      .values({
        table_id: this.table.id.value,
        subject_id: views.form.id,
      })
      .$if(this.dbProvider.isMysql(), (eb) => eb.ignore())
      .$if(!this.dbProvider.isMysql(), (eb) => eb.onConflict((ob) => ob.doNothing()))
      .compile()

    this.addSql(sql)
  }
  withoutForm(spec: WithoutFormSpecification): void {
    this.setData(tables.forms.name, this.table.forms ? json(this.table.forms?.toJSON()) : null)

    const deleteQuery = this.qb
      .deleteFrom("undb_table_id_mapping")
      .where((eb) => eb.eb("subject_id", "=", spec.formId))
      .compile()

    this.addSql(deleteQuery)
  }
  withForm(views: WithFormSpecification): void {
    this.setData(tables.forms.name, this.table.forms ? json(this.table.forms?.toJSON()) : null)
  }
  withForeignRollupField(spec: WithForeignRollupFieldSpec): void {
    throw new Error("Method not implemented.")
  }
  withTableForeignTables(spec: WithTableForeignTablesSpec): void {
    throw new Error("Method not implemented.")
  }
  withTableUnqueName(spec: TableUniqueNameSpecification): void {
    throw new Error("Method not implemented.")
  }
}

import type { ISpecVisitor } from "@undb/domain"
import type { TableBaseIdSpecification } from "./table-base-id.specification"
import type {
  TableFormsSpecification,
  WithFormIdSpecification,
  WithFormSpecification,
  WithNewFormSpecification,
  WithoutFormSpecification,
} from "./table-forms.specification"
import type { TableIdSpecification, TableIdsSpecification } from "./table-id.specification"
import type { TableNameSpecification, TableUniqueNameSpecification } from "./table-name.specification"
import type { WithTableRLS } from "./table-rls.specification"
import type {
  TableSchemaSpecification,
  WithDuplicatedFieldSpecification,
  WithForeignRollupFieldSpec,
  WithNewFieldSpecification,
  WithoutFieldSpecification,
  WithTableForeignTablesSpec,
  WithUpdatedFieldSpecification,
} from "./table-schema.specification"
import type { TableSpaceIdSpecification } from "./table-space-id.specification"
import type {
  WithNewView,
  WithoutView,
  WithView,
  WithViewAggregate,
  WithViewColor,
  WithViewFields,
  WithViewFieldWidth,
  WithViewFilter,
  WithViewIdSpecification,
  WithViewOption,
  WithViewSort,
  WithViewWidgets,
} from "./table-view.specification"
import type { TableViewsSpecification } from "./table-views.specification"
import type { DuplicatedTableSpecification } from "./table.specification"

export interface ITableSpecVisitor extends ISpecVisitor {
  withDuplicatedTable(spec: DuplicatedTableSpecification): void
  withId(id: TableIdSpecification): void
  withBaseId(id: TableBaseIdSpecification): void
  withSpaceId(id: TableSpaceIdSpecification): void
  idsIn(ids: TableIdsSpecification): void
  withName(name: TableNameSpecification): void
  withSchema(schema: TableSchemaSpecification): void
  withNewField(schema: WithNewFieldSpecification): void
  withDuplicateField(schema: WithDuplicatedFieldSpecification): void
  withoutField(schema: WithoutFieldSpecification): void
  withUpdatedField(spec: WithUpdatedFieldSpecification): void
  withTableRLS(rls: WithTableRLS): void
  withViews(views: TableViewsSpecification): void
  withView(views: WithView): void
  withNewView(views: WithNewView): void
  withoutView(view: WithoutView): void
  withViewId(spec: WithViewIdSpecification): void
  withViewFilter(viewFilter: WithViewFilter): void
  withViewOption(viewOption: WithViewOption): void
  withViewColor(viewColor: WithViewColor): void
  withViewSort(viewSort: WithViewSort): void
  withViewAggregate(viewColor: WithViewAggregate): void
  withViewFields(fields: WithViewFields): void
  withForms(views: TableFormsSpecification): void
  withoutForm(spec: WithoutFormSpecification): void
  withFormId(spec: WithFormIdSpecification): void
  withNewForm(views: WithNewFormSpecification): void
  withForm(views: WithFormSpecification): void
  withForeignRollupField(spec: WithForeignRollupFieldSpec): void
  withTableForeignTables(spec: WithTableForeignTablesSpec): void
  withTableUnqueName(spec: TableUniqueNameSpecification): void
  withViewFieldWidth(spec: WithViewFieldWidth): void
  withViewWidgets(spec: WithViewWidgets): void
}

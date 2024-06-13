import type { ISpecVisitor } from "@undb/domain"
import type {
  TableFormsSpecification,
  WithFormSpecification,
  WithNewFormSpecification,
} from "./table-forms.specification"
import type { TableIdSpecification, TableIdsSpecification } from "./table-id.specification"
import type { TableNameSpecification } from "./table-name.specification"
import type { WithTableRLS } from "./table-rls.specification"
import type {
  TableSchemaSpecification,
  WithNewFieldSpecification,
  WithUpdatedFieldSpecification,
} from "./table-schema.specification"
import type {
  WithNewView,
  WithView,
  WithViewAggregate,
  WithViewColor,
  WithViewFields,
  WithViewFilter,
  WithViewOption,
  WithViewSort,
} from "./table-view.specification"
import type { TableViewsSpecification } from "./table-views.specification"

export interface ITableSpecVisitor extends ISpecVisitor {
  withId(id: TableIdSpecification): void
  idsIn(ids: TableIdsSpecification): void
  withName(name: TableNameSpecification): void
  withSchema(schema: TableSchemaSpecification): void
  withNewField(schema: WithNewFieldSpecification): void
  withUpdatedField(spec: WithUpdatedFieldSpecification): void
  withTableRLS(rls: WithTableRLS): void
  withViews(views: TableViewsSpecification): void
  withView(views: WithView): void
  withNewView(views: WithNewView): void
  withViewFilter(viewFilter: WithViewFilter): void
  withViewOption(viewOption: WithViewOption): void
  withViewColor(viewColor: WithViewColor): void
  withViewSort(viewSort: WithViewSort): void
  withViewAggregate(viewColor: WithViewAggregate): void
  withViewFields(fields: WithViewFields): void
  withForms(views: TableFormsSpecification): void
  withNewForm(views: WithNewFormSpecification): void
  withForm(views: WithFormSpecification): void
}

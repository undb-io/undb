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
  WithViewOption,
  WithViewSort,
  WithoutView,
} from "@undb/table"
import { AbstractDBMutationVisitor } from "../abstract-db.visitor"
import type { tables } from "../tables"

export class TableMutationVisitor
  extends AbstractDBMutationVisitor<TableDo, typeof tables>
  implements ITableSpecVisitor
{
  constructor(public readonly table: TableDo) {
    super()
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
  }
  withNewField(schema: WithNewFieldSpecification): void {
    this.addUpdates({ schema: this.table.schema?.toJSON() })
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

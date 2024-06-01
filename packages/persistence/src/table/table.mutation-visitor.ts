import { NotImplementException, WontImplementException } from "@undb/domain"
import type {
  ITableSpecVisitor,
  TableDo,
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
import { AbstractDBMutationVisitor } from "../abstract-db.visitor"
import type { tables } from "../tables"

export class TableMutationVisitor
  extends AbstractDBMutationVisitor<TableDo, typeof tables>
  implements ITableSpecVisitor
{
  constructor(public readonly table: TableDo) {
    super()
  }
  withUpdatedField(spec: WithUpdatedFieldSpecification): void {
    const typeChanged = spec.field.type !== spec.previous.type
    console.log("typeChanged", typeChanged)
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
    throw new NotImplementException(TableMutationVisitor.name + ".withTableRLS")
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
}

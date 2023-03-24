/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { andOptions } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import type {
  WithDisplayFields,
  WithFieldDescription,
  WithFieldName,
  WithFieldRequirement,
  WithFormat,
  WithNewOption,
  WithOptions,
  WithSymmetricReferenceField,
  WithoutField,
  WithoutOption,
} from '../field/index.js'
import type {
  ITableSpecVisitor,
  TableCompositeSpecificaiton,
  WithFilter,
  WithNewField,
  WithTableId,
  WithTableName,
  WithTableSchema,
} from '../specifications/index.js'
import type { Table } from '../table.js'
import type {
  WithCalendarField,
  WithDisplayType,
  WithFieldOption,
  WithFieldVisibility,
  WithFieldWidth,
  WithKanbanField,
  WithNewView,
  WithShowSystemFieldsSpec,
  WithSorts,
  WithTableView,
  WithTableViews,
  WithTreeViewField,
  WithViewFieldsOrder,
  WithViewName,
  WithViewPinnedFields,
  WithViewsOrder,
  WithoutView,
} from '../view/index.js'
import { ForeignTableDomainFieldVisitor } from './foreign-table-domain-field.visitor.js'

export class ForeignTableDomainSpecificationVisitor implements ITableSpecVisitor {
  constructor(private readonly table: Table, private readonly foreignTable: Table) {}

  #specs: Option<TableCompositeSpecificaiton>[] = []

  get spec() {
    return andOptions(...this.#specs)
  }

  idEqual(s: WithTableId): void {}
  nameEqual(s: WithTableName): void {}
  schemaEqual(s: WithTableSchema): void {
    for (const field of s.schema.fields) {
      const v = new ForeignTableDomainFieldVisitor(this.table, this.foreignTable)
      field.accept(v)

      this.#specs.push(v.spec)
    }
  }
  viewsEqual(s: WithTableViews): void {}
  viewEqual(s: WithTableView): void {}
  viewNameEqual(s: WithViewName): void {}
  newView(s: WithNewView): void {}
  withoutView(s: WithoutView): void {}
  viewsOrderEqual(s: WithViewsOrder): void {}
  sortsEqual(s: WithSorts): void {}
  filterEqual(s: WithFilter): void {}
  fieldsOrder(s: WithViewFieldsOrder): void {}
  fieldOptionsEqual(s: WithFieldOption): void {}
  fieldWidthEqual(s: WithFieldWidth): void {}
  fieldVisibility(s: WithFieldVisibility): void {}
  pinnedFields(s: WithViewPinnedFields): void {}
  displayTypeEqual(s: WithDisplayType): void {}
  kanbanFieldEqual(s: WithKanbanField): void {}
  calendarFieldEqual(s: WithCalendarField): void {}
  treeViewFieldEqual(s: WithTreeViewField): void {}
  newField(s: WithNewField): void {
    const v = new ForeignTableDomainFieldVisitor(this.table, this.foreignTable)
    s.field.accept(v)

    this.#specs.push(v.spec)
  }
  withoutField(s: WithoutField): void {}
  optionsEqual(s: WithOptions): void {}
  optionEqual(s: WithNewOption): void {}
  newOption(s: WithNewOption): void {}
  witoutOption(s: WithoutOption): void {}
  withFieldName(s: WithFieldName): void {}
  withFieldDescription(s: WithFieldDescription): void {}
  displayFieldsEqual(s: WithDisplayFields): void {}
  withFormat(s: WithFormat): void {}
  withShowSystemFields(s: WithShowSystemFieldsSpec): void {}
  withFieldRequirement(s: WithFieldRequirement): void {}
  symmetricReferenceFieldEqual(s: WithSymmetricReferenceField): void {}
  not(): this {
    return this
  }
}

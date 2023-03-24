/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AutoIncrementField,
  BoolField,
  ColorField,
  CountField,
  CreatedAtField,
  DateField,
  DateRangeField,
  EmailField,
  IFieldVisitor,
  IdField,
  LookupField,
  NumberField,
  ParentField,
  RatingField,
  ReferenceField,
  SelectField,
  StringField,
  SumField,
  TreeField,
  UpdatedAtField,
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
import type { ITableRepository } from '../table.repository.js'
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
import { ForeignTableDomainSpecificationVisitor } from './foreign-table-domain-specification.visitor.js'

export class ForeignTableDomainService implements ITableSpecVisitor, IFieldVisitor {
  constructor(private readonly tableRepo: ITableRepository, private readonly table: Table) {}

  #foregnTableIds: string[] = []

  async handle(spec: TableCompositeSpecificaiton) {
    spec.accept(this)
    for (const foreignTableId of this.#foregnTableIds) {
      const foreignTable = (await this.tableRepo.findOneById(foreignTableId)).unwrap()
      const visitor = new ForeignTableDomainSpecificationVisitor(this.table, foreignTable)

      spec.accept(visitor)

      const foreignSpec = visitor.spec.into()
      if (foreignSpec) {
        foreignSpec.mutate(foreignTable)
        await this.tableRepo.updateOneById(foreignTable.id.value, foreignSpec)
      }
    }
  }

  id(field: IdField): void {}
  createdAt(field: CreatedAtField): void {}
  updatedAt(field: UpdatedAtField): void {}
  autoIncrement(field: AutoIncrementField): void {}
  string(field: StringField): void {}
  email(field: EmailField): void {}
  color(field: ColorField): void {}
  number(field: NumberField): void {}
  bool(field: BoolField): void {}
  date(field: DateField): void {}
  dateRange(field: DateRangeField): void {}
  select(field: SelectField): void {}
  reference(field: ReferenceField): void {
    const foreignTableId = field.foreignTableId.unwrap()
    if (!field.isOwner && foreignTableId !== this.table.id.value) {
      this.#foregnTableIds.push(foreignTableId)
    }
  }
  tree(field: TreeField): void {}
  parent(field: ParentField): void {}
  rating(field: RatingField): void {}
  count(field: CountField): void {}
  sum(field: SumField): void {}
  lookup(field: LookupField): void {}
  idEqual(s: WithTableId): void {}
  nameEqual(s: WithTableName): void {}
  schemaEqual(s: WithTableSchema): void {
    for (const field of s.schema.fields) {
      field.accept(this)
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
    s.field.accept(this)
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

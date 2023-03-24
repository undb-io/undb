/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { andOptions } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { Some } from 'oxide.ts'
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
} from '../field/index.js'
import { FieldId, WithSymmetricReferenceField } from '../field/index.js'
import type { TableCompositeSpecificaiton } from '../specifications/interface.js'
import type { Table } from '../table.js'

export class ForeignTableDomainFieldVisitor implements IFieldVisitor {
  #specs: Option<TableCompositeSpecificaiton>[] = []

  get spec() {
    return andOptions(...this.#specs)
  }

  constructor(private readonly table: Table, private readonly foreignTable: Table) {}
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
    const id = FieldId.createId()
    const spec = this.foreignTable.createField(undefined, {
      type: 'reference',
      id,
      foreignTableId: this.table.id.value,
      // TODO: get safe name
      name: field.id.value,
      symmetricReferenceFieldId: field.id.value,
    })

    this.#specs.push(Some(spec), Some(WithSymmetricReferenceField.fromString(field, id)))
  }
  tree(field: TreeField): void {}
  parent(field: ParentField): void {}
  rating(field: RatingField): void {}
  count(field: CountField): void {}
  sum(field: SumField): void {}
  lookup(field: LookupField): void {}
}

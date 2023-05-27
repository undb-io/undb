/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type {
  AttachmentField,
  AutoIncrementField,
  AverageField,
  BoolField,
  CollaboratorField,
  ColorField,
  CountField,
  CreatedAtField,
  CreatedByField,
  CurrencyField,
  DateField,
  DateRangeField,
  EmailField,
  Field,
  IFieldVisitor,
  IdField,
  LookupField,
  MultiSelectField,
  NumberField,
  ParentField,
  RatingField,
  ReferenceField,
  SelectField,
  StringField,
  SumField,
  TreeField,
  UpdatedAtField,
  UpdatedByField,
} from '@undb/core'
import { BaseEntityManager } from '../base-entity-manager.js'

export class RecordSqliteDuplicateValueVisitor extends BaseEntityManager implements IFieldVisitor {
  constructor(
    private readonly tableId: string,
    private readonly from: Field,
    em: EntityManager,
    private readonly qb: Knex.QueryBuilder,
    private readonly knex: Knex,
  ) {
    super(em)
  }

  id(field: IdField): void {
    throw new Error('Method not implemented.')
  }
  createdAt(field: CreatedAtField): void {
    throw new Error('Method not implemented.')
  }
  createdBy(field: CreatedByField): void {
    throw new Error('Method not implemented.')
  }
  updatedAt(field: UpdatedAtField): void {
    throw new Error('Method not implemented.')
  }
  updatedBy(field: UpdatedByField): void {
    throw new Error('Method not implemented.')
  }
  attachment(field: AttachmentField): void {
    throw new Error('Method not implemented.')
  }
  autoIncrement(field: AutoIncrementField): void {
    throw new Error('Method not implemented.')
  }
  string(field: StringField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  email(field: EmailField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  color(field: ColorField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  number(field: NumberField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  bool(field: BoolField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  date(field: DateField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  dateRange(field: DateRangeField): void {
    throw new Error('Method not implemented.')
  }
  select(field: SelectField): void {
    throw new Error('Method not implemented.')
  }
  multiSelect(field: MultiSelectField): void {
    throw new Error('Method not implemented.')
  }
  reference(field: ReferenceField): void {
    throw new Error('Method not implemented.')
  }
  tree(field: TreeField): void {
    throw new Error('Method not implemented.')
  }
  parent(field: ParentField): void {
    throw new Error('Method not implemented.')
  }
  rating(field: RatingField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  currency(field: CurrencyField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  count(field: CountField): void {}
  sum(field: SumField): void {}
  average(field: AverageField): void {}
  lookup(field: LookupField): void {}
  collaborator(field: CollaboratorField): void {
    throw new Error('Method not implemented.')
  }
}

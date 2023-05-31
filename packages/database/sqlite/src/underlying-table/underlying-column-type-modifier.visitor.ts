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
  IFieldType,
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
import { BaseEntityManager } from '../repository/base-entity-manager.js'
import { NumberColumnTypeModifier } from './column-type-modifier/number.column-type-modifier.js'
import { StringColumnTypeModifier } from './column-type-modifier/string.column-type-modifier.js'

export class UnderlyingColumnConvertTypeVisitor extends BaseEntityManager implements IFieldVisitor {
  constructor(
    private readonly tableName: string,
    private readonly newType: IFieldType,
    em: EntityManager,
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
    const modifier = new StringColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  email(field: EmailField): void {
    throw new Error('Method not implemented.')
  }
  color(field: ColorField): void {
    throw new Error('Method not implemented.')
  }
  number(field: NumberField): void {
    const modifier = new NumberColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  bool(field: BoolField): void {
    throw new Error('Method not implemented.')
  }
  date(field: DateField): void {
    throw new Error('Method not implemented.')
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
    throw new Error('Method not implemented.')
  }
  currency(field: CurrencyField): void {
    throw new Error('Method not implemented.')
  }
  count(field: CountField): void {
    throw new Error('Method not implemented.')
  }
  sum(field: SumField): void {
    throw new Error('Method not implemented.')
  }
  average(field: AverageField): void {
    throw new Error('Method not implemented.')
  }
  lookup(field: LookupField): void {
    throw new Error('Method not implemented.')
  }
  collaborator(field: CollaboratorField): void {
    throw new Error('Method not implemented.')
  }
}

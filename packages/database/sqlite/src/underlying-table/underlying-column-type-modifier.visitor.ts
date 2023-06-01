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
import { AttachmentColumnTypeModifier } from './column-type-modifier/attachment.column-type-modifier.js'
import { BoolColumnTypeModifier } from './column-type-modifier/bool.column-type-modifier.js'
import { ColorColumnTypeModifier } from './column-type-modifier/color.column-type-modifier.js'
import { EmailColumnTypeModifier } from './column-type-modifier/email.column-type-modifier.js'
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
    const modifier = new AttachmentColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
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
    const modifier = new EmailColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  color(field: ColorField): void {
    const modifier = new ColorColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  number(field: NumberField): void {
    const modifier = new NumberColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  bool(field: BoolField): void {
    const modifier = new BoolColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
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

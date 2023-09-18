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
  JsonField,
  LookupField,
  MaxField,
  MinField,
  MultiSelectField,
  NumberField,
  ParentField,
  QRCodeField,
  RatingField,
  ReferenceField,
  SelectField,
  StringField,
  SumField,
  TreeField,
  UpdatedAtField,
  UpdatedByField,
  UrlField,
} from '@undb/core'
import { BaseEntityManager } from '../repository/base-entity-manager.js'
import { AttachmentColumnTypeModifier } from './column-type-modifier/attachment.column-type-modifier.js'
import { AverageColumnTypeModifier } from './column-type-modifier/average.column-type-modifier.js'
import { BoolColumnTypeModifier } from './column-type-modifier/bool.column-type-modifier.js'
import { CollaboratorColumnTypeModifier } from './column-type-modifier/collaborator.column-type-modifier.js'
import { ColorColumnTypeModifier } from './column-type-modifier/color.column-type-modifier.js'
import { CountColumnTypeModifier } from './column-type-modifier/count.column-type-modifier.js'
import { CurrencyColumnTypeModifier } from './column-type-modifier/currency.column-type-modifier.js'
import { DateRangeColumnTypeModifier } from './column-type-modifier/date-range.column-type-modifier.js'
import { DateColumnTypeModifier } from './column-type-modifier/date.column-type-modifier.js'
import { EmailColumnTypeModifier } from './column-type-modifier/email.column-type-modifier.js'
import { JsonColumnTypeModifier } from './column-type-modifier/json.column-type-modifier.js'
import { LookupColumnTypeModifier } from './column-type-modifier/lookup.column-type-modifier.js'
import { MaxColumnTypeModifier } from './column-type-modifier/max.column-type-modifier.js'
import { MinColumnTypeModifier } from './column-type-modifier/min.column-type-modifier.js'
import { MultiSelectColumnTypeModifier } from './column-type-modifier/multi-select.column-type-modifier.js'
import { NumberColumnTypeModifier } from './column-type-modifier/number.column-type-modifier.js'
import { QRCodeColumnTypeModifier } from './column-type-modifier/qrcode.column-type-modifier.js'
import { RatingColumnTypeModifier } from './column-type-modifier/rating.column-type-modifier.js'
import { SelectColumnTypeModifier } from './column-type-modifier/select.column-type-modifier.js'
import { StringColumnTypeModifier } from './column-type-modifier/string.column-type-modifier.js'
import { SumColumnTypeModifier } from './column-type-modifier/sum.column-type-modifier.js'
import { UrlColumnTypeModifier } from './column-type-modifier/url.column-type-modifier.js'

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
  url(field: UrlField): void {
    const modifier = new UrlColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  json(field: JsonField): void {
    const modifier = new JsonColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
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
    const modifier = new DateColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  dateRange(field: DateRangeField): void {
    const modifier = new DateRangeColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  select(field: SelectField): void {
    const modifier = new SelectColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  multiSelect(field: MultiSelectField): void {
    const modifier = new MultiSelectColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  qrcode(field: QRCodeField): void {
    const modifier = new QRCodeColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
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
    const modifier = new RatingColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  currency(field: CurrencyField): void {
    const modifier = new CurrencyColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  count(field: CountField): void {
    const modifier = new CountColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  sum(field: SumField): void {
    const modifier = new SumColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  average(field: AverageField): void {
    const modifier = new AverageColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  lookup(field: LookupField): void {
    const modifier = new LookupColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  collaborator(field: CollaboratorField): void {
    const modifier = new CollaboratorColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  min(field: MinField): void {
    const modifier = new MinColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
  max(field: MaxField): void {
    const modifier = new MaxColumnTypeModifier(field, this.tableName, this.newType, this.em, this.knex)
    modifier[this.newType]()
    this.unshiftQueries(...modifier.queries)
    this.unshiftJobs(...modifier.jobs)
  }
}

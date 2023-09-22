import {
  BooleanType,
  Cascade,
  Collection,
  Entity,
  LoadStrategy,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  SmallIntType,
  type Rel,
} from '@mikro-orm/core'
import type {
  IAttachmentFieldQuerySchema,
  IAutoIncrementFieldQuerySchema,
  IAverageFieldQuerySchema,
  IBoolFieldQuerySchema,
  ICollaboratorFieldQuerySchema,
  IColorFieldQuerySchema,
  ICountFieldQuerySchema,
  ICreatedAtFieldQuerySchema,
  ICreatedByFieldQuerySchema,
  ICurrencyFieldQuerySchema,
  IDateFieldQuerySchema,
  IDateRangeFieldQuerySchema,
  IEmailFieldQuerySchema,
  IIdFieldQuerySchema,
  IJsonFieldQuerySchema,
  ILookupFieldQuerySchema,
  IMaxFieldQuerySchema,
  IMinFieldQuerySchema,
  IMultiSelectFieldQuerySchema,
  INumberFieldQuerySchema,
  IOptionColorName,
  IParentFieldQuerySchema,
  IQRCodeFieldQuerySchema,
  IQueryFieldSchema,
  IRatingFieldQuerySchema,
  IReferenceFieldQuerySchema,
  ISelectFieldQuerySchema,
  IStringFieldQuerySchema,
  ISumFieldQuerySchema,
  ITimeFormat,
  ITreeFieldQuerySchema,
  IUpdatedAtFieldQuerySchema,
  IUpdatedByFieldQuerySchema,
  IUrlFieldQuerySchema,
} from '@undb/core'
import {
  AttachmentField as CoreAttachmentField,
  AutoIncrementField as CoreAutoIncrementField,
  AverageField as CoreAverageField,
  BoolField as CoreBoolField,
  CollaboratorField as CoreCollaboratorField,
  ColorField as CoreColorField,
  CountField as CoreCountField,
  CreatedAtField as CoreCreatedAtField,
  CreatedByField as CoreCreatedByField,
  CurrencyField as CoreCurrencyField,
  DateField as CoreDateField,
  DateRangeField as CoreDateRangeField,
  EmailField as CoreEmailField,
  IdField as CoreIdField,
  JsonField as CoreJsonField,
  LookupField as CoreLookupField,
  MaxField as CoreMaxField,
  MinField as CoreMinField,
  MultiSelectField as CoreMultiSelectField,
  NumberField as CoreNumberField,
  ParentField as CoreParentField,
  QRCodeField as CoreQRCodeField,
  RatingField as CoreRatingField,
  ReferenceField as CoreReferenceField,
  SelectField as CoreSelectField,
  StringField as CoreStringField,
  SumField as CoreSumField,
  TreeField as CoreTreeField,
  UpdatedAtField as CoreUpdatedAtField,
  UpdatedByField as CoreUpdatedByField,
  UrlField as CoreUrlField,
  type Field as CoreField,
  type ICurrencySymbol,
} from '@undb/core'
import { BaseEntity } from './base.entity.js'
import { Option } from './option.js'
import { Table } from './table.js'

@Entity({ tableName: 'undb_field', abstract: true, discriminatorColumn: 'type' })
export abstract class Field extends BaseEntity {
  constructor(table: Rel<Table>, field: CoreField) {
    super()
    this.id = field.id.value
    this.table = table
    this.name = field.name.value
    this.type = field.type
    this.system = field.system
    this.description = field.description?.value
    this.required = field.required
    this.display = field.display
  }

  @PrimaryKey()
  id: string

  @ManyToOne(() => Table, { cascade: [Cascade.ALL] })
  table: Rel<Table>

  @Property()
  name: string

  @Property({ nullable: true })
  description?: string

  @Property({ type: BooleanType, default: false })
  system = false

  @Property({ type: BooleanType, default: false })
  required = false

  @Property({ type: BooleanType, default: false })
  display = false

  @Property()
  type: string

  abstract toDomain(): CoreField
  abstract toQuery(): IQueryFieldSchema
}

@Entity({ discriminatorValue: 'id' })
export class IdField extends Field {
  toDomain(): CoreIdField {
    return CoreIdField.unsafeCreate({
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'id',
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IIdFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'id',
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'created-at' })
export class CreatedAtField extends Field {
  constructor(table: Rel<Table>, field: CoreCreatedAtField) {
    super(table, field)
    this.format = field.formatString
  }

  @Property()
  format: string

  @Property({ nullable: true })
  timeFormat?: ITimeFormat | null

  toDomain(): CoreCreatedAtField {
    return CoreCreatedAtField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'created-at',
      description: this.description,
      format: this.format,
      timeFormat: this.timeFormat,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): ICreatedAtFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'created-at',
      description: this.description,
      format: this.format,
      timeFormat: this.timeFormat,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'created-by' })
export class CreatedByField extends Field {
  toDomain(): CoreCreatedByField {
    return CoreCreatedByField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'created-by',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): ICreatedByFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'created-by',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'updated-by' })
export class UpdatedByField extends Field {
  toDomain(): CoreUpdatedByField {
    return CoreUpdatedByField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'updated-by',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IUpdatedByFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'updated-by',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'updated-at' })
export class UpdatedAtField extends Field {
  constructor(table: Rel<Table>, field: CoreUpdatedAtField) {
    super(table, field)
    this.format = field.formatString
  }

  @Property()
  format: string

  @Property({ nullable: true })
  timeFormat?: ITimeFormat | null

  toDomain(): CoreUpdatedAtField {
    return CoreUpdatedAtField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'updated-at',
      description: this.description,
      format: this.format,
      timeFormat: this.timeFormat,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IUpdatedAtFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'updated-at',
      description: this.description,
      format: this.format,
      timeFormat: this.timeFormat,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'auto-increment' })
export class AutoIncrementField extends Field {
  toDomain(): CoreAutoIncrementField {
    return CoreAutoIncrementField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'auto-increment',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IAutoIncrementFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'auto-increment',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'string' })
export class StringField extends Field {
  toDomain(): CoreStringField {
    return CoreStringField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'string',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IStringFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'string',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'email' })
export class EmailField extends Field {
  toDomain(): CoreEmailField {
    return CoreEmailField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'email',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IEmailFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'email',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'url' })
export class UrlField extends Field {
  toDomain(): CoreUrlField {
    return CoreUrlField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'url',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IUrlFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'url',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'json' })
export class JsonField extends Field {
  toDomain(): CoreJsonField {
    return CoreJsonField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'json',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IJsonFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'json',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'attachment' })
export class AttachmentField extends Field {
  toDomain(): CoreAttachmentField {
    return CoreAttachmentField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'attachment',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IAttachmentFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'attachment',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'color' })
export class ColorField extends Field {
  toDomain(): CoreColorField {
    return CoreColorField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'color',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IColorFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'color',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'number' })
export class NumberField extends Field {
  toDomain(): CoreNumberField {
    return CoreNumberField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'number',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): INumberFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'number',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'rating' })
export class RatingField extends Field {
  constructor(table: Rel<Table>, field: CoreRatingField) {
    super(table, field)
    this.max = field.max
  }

  @Property({ type: SmallIntType })
  max: number

  toDomain(): CoreRatingField {
    return CoreRatingField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'rating',
      max: this.max,
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IRatingFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'rating',
      max: this.max,
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'currency' })
export class CurrencyField extends Field {
  constructor(table: Rel<Table>, field: CoreCurrencyField) {
    super(table, field)
    this.symbol = field.symbol.symbol
  }

  @Property({ type: 'string' })
  symbol: ICurrencySymbol

  toDomain(): CoreCurrencyField {
    return CoreCurrencyField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'currency',
      symbol: this.symbol,
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): ICurrencyFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'currency',
      symbol: this.symbol,
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}
@Entity({ discriminatorValue: 'bool' })
export class BoolField extends Field {
  toDomain(): CoreBoolField {
    return CoreBoolField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'bool',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IBoolFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'bool',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'date' })
export class DateField extends Field {
  constructor(table: Rel<Table>, field: CoreDateField) {
    super(table, field)
    this.format = field.formatString
  }

  @Property()
  format: string

  @Property({ nullable: true })
  timeFormat?: ITimeFormat | null

  toDomain(): CoreDateField {
    return CoreDateField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'date',
      format: this.format,
      timeFormat: this.timeFormat,
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IDateFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'date',
      format: this.format,
      timeFormat: this.timeFormat,
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'date-range' })
export class DateRangeField extends Field {
  constructor(table: Rel<Table>, field: CoreDateRangeField) {
    super(table, field)
    this.format = field.formatString
  }

  @Property()
  format: string

  @Property({ nullable: true })
  timeFormat?: ITimeFormat | null

  toDomain(): CoreDateRangeField {
    return CoreDateRangeField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'date-range',
      format: this.format,
      timeFormat: this.timeFormat,
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IDateRangeFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'date-range',
      format: this.format,
      timeFormat: this.timeFormat,
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'select' })
export class SelectField extends Field {
  @OneToMany(() => Option, (option) => option.field, { orphanRemoval: true, cascade: [Cascade.ALL] })
  options = new Collection<Option>(this)

  toDomain(): CoreSelectField {
    return CoreSelectField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'select',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
      options: this.options.getItems(false).map((o) => ({
        key: o.key,
        name: o.name,
        color: {
          name: o.color.name as IOptionColorName,
          shade: o.color.shade,
        },
      })),
    })
  }

  toQuery(): ISelectFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'select',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
      options: this.options.getItems(false).map((o) => ({
        key: o.key,
        name: o.name,
        color: {
          name: o.color.name as IOptionColorName,
          shade: o.color.shade,
        },
      })),
    }
  }
}

@Entity({ discriminatorValue: 'multi-select' })
export class MultiSelectField extends Field {
  @OneToMany(() => Option, (option) => option.field, { orphanRemoval: true, cascade: [Cascade.ALL] })
  options = new Collection<Option>(this)

  toDomain(): CoreMultiSelectField {
    return CoreMultiSelectField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'multi-select',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
      options: this.options.getItems(false).map((o) => ({
        key: o.key,
        name: o.name,
        color: {
          name: o.color.name as IOptionColorName,
          shade: o.color.shade,
        },
      })),
    })
  }

  toQuery(): IMultiSelectFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'multi-select',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
      options: this.options.getItems(false).map((o) => ({
        key: o.key,
        name: o.name,
        color: {
          name: o.color.name as IOptionColorName,
          shade: o.color.shade,
        },
      })),
    }
  }
}

@Entity({ discriminatorValue: 'reference' })
export class ReferenceField extends Field {
  constructor(table: Rel<Table>, field: CoreReferenceField) {
    super(table, field)
    this.isOwner = field.isOwner
  }

  @ManyToOne(() => Table, { strategy: LoadStrategy.JOINED })
  foreignTable?: Rel<Table>

  @ManyToMany({ entity: () => Field, owner: true })
  displayFields = new Collection<Field>(this)

  @OneToMany(() => CountField, (f) => f.countReferenceField)
  countFields = new Collection<CountField>(this)

  @OneToMany(() => SumField, (f) => f.sumReferenceField)
  sumFields = new Collection<SumField>(this)

  @OneToMany(() => AverageField, (f) => f.averageReferenceField)
  averageFields = new Collection<AverageField>(this)

  @OneToMany(() => LookupField, (f) => f.lookupReferenceField)
  lookupFields = new Collection<LookupField>(this)

  @OneToMany(() => MinField, (f) => f.minReferenceField)
  minFields = new Collection<MinField>(this)

  @OneToMany(() => MaxField, (f) => f.maxReferenceField)
  maxFields = new Collection<MaxField>(this)

  @OneToOne(() => ReferenceField, { nullable: true })
  symmetricReferenceField?: ReferenceField

  @Property({ type: BooleanType, default: false, nullable: false })
  isOwner?: boolean

  get foreignDisplayFields() {
    if (!this.displayFields.isInitialized()) {
      return []
    }

    let displayFields = this.displayFields.getItems(false)
    if (!displayFields.length) {
      displayFields = this.foreignTable?.fields?.getItems(false).filter((f) => f.display) ?? []
    }

    return displayFields
  }

  toDomain(): CoreReferenceField {
    return CoreReferenceField.unsafeCreate({
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'reference',
      foreignTableId: this.foreignTable?.isDeleted ? undefined : this.foreignTable?.id,
      displayFieldIds: this.foreignDisplayFields?.map((f) => f.id),
      symmetricReferenceFieldId: this.symmetricReferenceField?.id,
      required: !!this.required,
      display: !!this.display,
      bidirectional: !!this.isOwner,
    })
  }

  toQuery(): IReferenceFieldQuerySchema {
    const isForeignTableDeleted = this.foreignTable?.isDeleted
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'reference',
      foreignTableId: isForeignTableDeleted ? undefined : this.foreignTable?.id,
      displayFieldIds: isForeignTableDeleted ? [] : this.foreignDisplayFields?.map((f) => f.id),
      symmetricReferenceFieldId: isForeignTableDeleted
        ? undefined
        : this.symmetricReferenceField?.isDeleted
        ? undefined
        : this.symmetricReferenceField?.id,
      required: !!this.required,
      display: !!this.display,
      bidirectional: !!this.isOwner,
    }
  }
}

@Entity({ discriminatorValue: 'collaborator' })
export class CollaboratorField extends Field {
  toDomain(): CoreCollaboratorField {
    return CoreCollaboratorField.unsafeCreate({
      id: this.id,
      name: this.name,
      type: 'collaborator',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): ICollaboratorFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      type: 'collaborator',
      description: this.description,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'tree' })
export class TreeField extends Field {
  constructor(table: Rel<Table>, field: CoreTreeField) {
    super(table, field)
    this.parentFieldId = field.parentFieldId!.value
  }

  @Property()
  parentFieldId: string

  @ManyToMany({ entity: () => Field, owner: true })
  displayFields = new Collection<Field>(this)

  @OneToMany(() => CountField, (f) => f.countReferenceField)
  countFields = new Collection<CountField>(this)

  @OneToMany(() => SumField, (f) => f.sumReferenceField)
  sumFields = new Collection<SumField>(this)

  @OneToMany(() => AverageField, (f) => f.averageReferenceField)
  averageFields = new Collection<AverageField>(this)

  @OneToMany(() => LookupField, (f) => f.lookupReferenceField)
  lookupFields = new Collection<LookupField>(this)

  @OneToMany(() => MinField, (f) => f.minReferenceField)
  minFields = new Collection<MinField>(this)

  @OneToMany(() => MaxField, (f) => f.maxReferenceField)
  maxFields = new Collection<MaxField>(this)

  get foreignDisplayFields() {
    let displayFields = this.displayFields.getItems(false)
    if (!displayFields.length) {
      displayFields = this.table.fields.getItems(false).filter((f) => f.display)
    }

    return displayFields
  }

  toDomain(): CoreTreeField {
    return CoreTreeField.unsafeCreate({
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'tree',
      parentFieldId: this.parentFieldId,
      displayFieldIds: this.foreignDisplayFields.map((f) => f.id),
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): ITreeFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'tree',
      parentFieldId: this.parentFieldId,
      displayFieldIds: this.foreignDisplayFields.map((f) => f.id),
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'parent' })
export class ParentField extends Field {
  constructor(table: Rel<Table>, field: CoreParentField) {
    super(table, field)
    this.treeFieldId = field.treeFieldId.value
  }

  @Property()
  treeFieldId: string

  @ManyToMany({ entity: () => Field, owner: true })
  displayFields = new Collection<Field>(this)

  @OneToMany(() => LookupField, (f) => f.lookupReferenceField)
  lookupFields = new Collection<LookupField>(this)

  get foreignDisplayFields() {
    let displayFields = this.displayFields.getItems(false)
    if (!displayFields.length) {
      displayFields = this.table.fields.getItems(false).filter((f) => f.display)
    }

    return displayFields
  }

  toDomain(): CoreParentField {
    return CoreParentField.unsafeCreate({
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'parent',
      treeFieldId: this.treeFieldId,
      displayFieldIds: this.foreignDisplayFields.map((f) => f.id),
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IParentFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'parent',
      treeFieldId: this.treeFieldId,
      displayFieldIds: this.foreignDisplayFields.map((f) => f.id),
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'count' })
export class CountField extends Field {
  constructor(table: Rel<Table>, field: CoreCountField) {
    super(table, field)
  }

  @ManyToOne({ entity: () => ReferenceField || TreeField, inversedBy: (f) => f.countFields })
  countReferenceField!: ReferenceField | TreeField

  toDomain(): CoreCountField {
    return CoreCountField.unsafeCreate({
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'count',
      required: !!this.required,
      display: !!this.display,
      referenceFieldId: this.countReferenceField?.id,
    })
  }

  toQuery(): ICountFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'count',
      referenceFieldId: this.countReferenceField?.id,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'sum' })
export class SumField extends Field {
  constructor(table: Rel<Table>, field: CoreSumField) {
    super(table, field)
  }

  @ManyToOne({ entity: () => ReferenceField || TreeField, inversedBy: (f) => f.sumFields })
  sumReferenceField!: ReferenceField | TreeField

  @ManyToOne({ entity: () => Field })
  sumAggregateField!: Field

  toDomain(): CoreSumField {
    return CoreSumField.unsafeCreate({
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'sum',
      required: !!this.required,
      display: !!this.display,
      referenceFieldId: this.sumReferenceField?.id,
      aggregateFieldId: this.sumAggregateField?.id,
    })
  }

  toQuery(): ISumFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'sum',
      referenceFieldId: this.sumReferenceField?.id,
      aggregateFieldId: this.sumAggregateField?.id,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'average' })
export class AverageField extends Field {
  constructor(table: Rel<Table>, field: CoreAverageField) {
    super(table, field)
  }

  @ManyToOne({ entity: () => ReferenceField || TreeField, inversedBy: (f) => f.averageFields })
  averageReferenceField!: ReferenceField | TreeField

  @ManyToOne({ entity: () => Field })
  averageAggregateField!: Field

  toDomain(): CoreAverageField {
    return CoreAverageField.unsafeCreate({
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'average',
      required: !!this.required,
      display: !!this.display,
      referenceFieldId: this.averageReferenceField?.id,
      aggregateFieldId: this.averageAggregateField?.id,
    })
  }

  toQuery(): IAverageFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'average',
      referenceFieldId: this.averageReferenceField?.id,
      aggregateFieldId: this.averageAggregateField?.id,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'lookup' })
export class LookupField extends Field {
  constructor(table: Rel<Table>, field: CoreLookupField) {
    super(table, field)
  }

  @ManyToOne({ entity: () => ReferenceField || TreeField || ParentField, inversedBy: (f) => f.lookupFields })
  lookupReferenceField!: ReferenceField | TreeField | ParentField

  @ManyToMany({ entity: () => Field, owner: true })
  displayFields = new Collection<Field>(this)

  get foreignDisplayFields() {
    const displayFieleds = this.displayFields.getItems(false)
    if (!displayFieleds.length) {
      return this.lookupReferenceField.foreignDisplayFields
    }
    return displayFieleds
  }

  toDomain(): CoreLookupField {
    return CoreLookupField.unsafeCreate({
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'lookup',
      required: !!this.required,
      display: !!this.display,
      referenceFieldId: this.lookupReferenceField?.id,
      displayFieldIds: this.foreignDisplayFields.map((f) => f.id) as [string, ...string[]],
    })
  }

  toQuery(): ILookupFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'lookup',
      referenceFieldId: this.lookupReferenceField?.id,
      required: !!this.required,
      display: !!this.display,
      displayFieldIds: this.foreignDisplayFields.map((f) => f.id) as [string, ...string[]],
    }
  }
}

@Entity({ discriminatorValue: 'qrcode' })
export class QRCodeField extends Field {
  constructor(table: Rel<Table>, field: CoreQRCodeField) {
    super(table, field)
    this.displayRecordURL = !!field.data.unpack().displayRecordURL
  }

  @Property({ default: false })
  displayRecordURL!: boolean

  @ManyToOne({ entity: () => Field, nullable: true })
  dataField?: Field

  toDomain(): CoreQRCodeField {
    return CoreQRCodeField.unsafeCreate({
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'qrcode',
      required: !!this.required,
      display: !!this.display,
    })
  }

  toQuery(): IQRCodeFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'qrcode',
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'min' })
export class MinField extends Field {
  constructor(table: Rel<Table>, field: CoreMinField) {
    super(table, field)
  }

  @ManyToOne({ entity: () => ReferenceField || TreeField, inversedBy: (f) => f.minFields })
  minReferenceField!: ReferenceField | TreeField

  @ManyToOne({ entity: () => Field })
  minAggregateField!: Field

  toDomain(): CoreMinField {
    return CoreMinField.unsafeCreate({
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'min',
      required: !!this.required,
      display: !!this.display,
      referenceFieldId: this.minReferenceField?.id,
      aggregateFieldId: this.minAggregateField?.id,
    })
  }

  toQuery(): IMinFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'min',
      referenceFieldId: this.minReferenceField?.id,
      aggregateFieldId: this.minAggregateField?.id,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

@Entity({ discriminatorValue: 'max' })
export class MaxField extends Field {
  constructor(table: Rel<Table>, field: CoreMaxField) {
    super(table, field)
  }

  @ManyToOne({ entity: () => ReferenceField || TreeField, inversedBy: (f) => f.maxFields })
  maxReferenceField!: ReferenceField | TreeField

  @ManyToOne({ entity: () => Field })
  maxAggregateField!: Field

  toDomain(): CoreMaxField {
    return CoreMaxField.unsafeCreate({
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'max',
      required: !!this.required,
      display: !!this.display,
      referenceFieldId: this.maxReferenceField?.id,
      aggregateFieldId: this.maxAggregateField?.id,
    })
  }

  toQuery(): IMaxFieldQuerySchema {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'max',
      referenceFieldId: this.maxReferenceField?.id,
      aggregateFieldId: this.maxAggregateField?.id,
      required: !!this.required,
      display: !!this.display,
    }
  }
}

export type IField =
  | IdField
  | CreatedAtField
  | UpdatedAtField
  | AutoIncrementField
  | StringField
  | EmailField
  | UrlField
  | JsonField
  | ColorField
  | NumberField
  | BoolField
  | DateField
  | DateRangeField
  | SelectField
  | MultiSelectField
  | ReferenceField
  | TreeField
  | ParentField
  | RatingField
  | CurrencyField
  | CountField
  | LookupField
  | QRCodeField
  | SumField
  | AverageField
  | AttachmentField
  | CollaboratorField
  | CreatedByField
  | UpdatedByField
  | MinField
  | MaxField

export const fieldEntities = [
  IdField,
  CreatedAtField,
  UpdatedAtField,
  AutoIncrementField,
  StringField,
  EmailField,
  JsonField,
  ColorField,
  NumberField,
  BoolField,
  DateField,
  DateRangeField,
  SelectField,
  MultiSelectField,
  ReferenceField,
  TreeField,
  ParentField,
  RatingField,
  CurrencyField,
  CountField,
  LookupField,
  SumField,
  AverageField,
  AttachmentField,
  CollaboratorField,
  CreatedByField,
  UpdatedByField,
  UrlField,
  MinField,
  MaxField,
  QRCodeField,
]

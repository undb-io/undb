/* eslint-disable @typescript-eslint/no-unused-vars */
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type { CurrencyField, JsonField, MultiSelectField, QRCodeField, UrlField } from '@undb/core'
import {
  INTERNAL_COLUMN_CREATED_BY_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_BY_NAME,
  type AttachmentField,
  type AutoIncrementField,
  type AverageField,
  type BoolField,
  type ChartVisualization,
  type CollaboratorField,
  type ColorField,
  type CountField,
  type CreatedAtField,
  type CreatedByField,
  type DateField,
  type DateRangeField,
  type EmailField,
  type IFieldVisitor,
  type IdField,
  type LookupField,
  type MaxField,
  type MinField,
  type NumberField,
  type ParentField,
  type RatingField,
  type ReferenceField,
  type SelectField,
  type StringField,
  type SumField,
  type Table,
  type TableSchemaIdMap,
  type TreeField,
  type UpdatedAtField,
  type UpdatedByField,
} from '@undb/core'
import { User } from '../../entity/user.js'
import { CollaboratorForeignTable } from '../../underlying-table/underlying-foreign-table.js'
import { getForeignTableAlias } from './record.constants.js'

export class RecordChartGroupVisitor implements IFieldVisitor {
  constructor(
    private readonly table: Table,
    private readonly fieldId: string,
    private readonly visualization: ChartVisualization,
    private readonly em: EntityManager,
    public readonly qb: Knex.QueryBuilder,
  ) {
    this.knex = em.getKnex()
    this.schema = table.schema.toIdMap()
  }

  private readonly knex: Knex
  private readonly schema: TableSchemaIdMap

  id(field: IdField): void {
    throw new Error('Method not implemented.')
  }
  createdAt(field: CreatedAtField): void {
    throw new Error('Method not implemented.')
  }
  createdBy(field: CreatedByField): void {
    const {
      properties: { id, username, avatar, color },
      tableName,
    } = this.em.getMetadata().get(User.name)

    this.qb
      .select(
        `${INTERNAL_COLUMN_CREATED_BY_NAME} as key`,
        this.knex.raw(
          `json_object(
          '${username.fieldNames[0]}', ${tableName}.${username.fieldNames[0]},
          '${avatar.fieldNames[0]}', ${tableName}.${avatar.fieldNames[0]},
          '${color.fieldNames[0]}', ${tableName}.${color.fieldNames[0]}
        ) as meta`,
        ),
      )
      .from(this.table.id.value)
      .groupBy(INTERNAL_COLUMN_CREATED_BY_NAME)
      .count('* as value')
      .leftJoin(tableName, `${tableName}.${id.fieldNames[0]}`, INTERNAL_COLUMN_CREATED_BY_NAME)
  }
  updatedAt(field: UpdatedAtField): void {
    throw new Error('Method not implemented.')
  }
  updatedBy(field: UpdatedByField): void {
    const {
      properties: { id, username, avatar, color },
      tableName,
    } = this.em.getMetadata().get(User.name)

    this.qb
      .select(
        `${INTERNAL_COLUMN_CREATED_BY_NAME} as key`,
        this.knex.raw(
          `json_object(
          '${username.fieldNames[0]}', ${tableName}.${username.fieldNames[0]},
          '${avatar.fieldNames[0]}', ${tableName}.${avatar.fieldNames[0]},
          '${color.fieldNames[0]}', ${tableName}.${color.fieldNames[0]}
        ) as meta`,
        ),
      )
      .from(this.table.id.value)
      .groupBy(INTERNAL_COLUMN_UPDATED_BY_NAME)
      .count('* as value')
      .leftJoin(tableName, `${tableName}.${id.fieldNames[0]}`, INTERNAL_COLUMN_UPDATED_BY_NAME)
  }
  attachment(field: AttachmentField): void {
    throw new Error('Method not implemented.')
  }
  autoIncrement(field: AutoIncrementField): void {
    throw new Error('Method not implemented.')
  }
  string(field: StringField): void {
    throw new Error('Method not implemented.')
  }
  email(field: EmailField): void {
    throw new Error('Method not implemented.')
  }
  url(field: UrlField): void {
    throw new Error('Method not implemented.')
  }
  qrcode(field: QRCodeField): void {
    throw new Error('Method not implemented.')
  }
  json(field: JsonField): void {
    throw new Error('Method not implemented.')
  }
  color(field: ColorField): void {
    throw new Error('Method not implemented.')
  }
  number(field: NumberField): void {
    throw new Error('Method not implemented.')
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
    this.qb.from(this.table.id.value).select(`${this.fieldId} as key`).groupBy(this.fieldId).count('* as value')
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
    const {
      properties: { id, username, avatar, color },
      tableName,
    } = this.em.getMetadata().get(User.name)

    const ft = new CollaboratorForeignTable(this.table.id.value, field.id.value)
    const fta = getForeignTableAlias(field, this.schema)

    const subQuery = this.knex
      .queryBuilder()
      .select(`${ft.name}.${CollaboratorForeignTable.USER_ID}`)
      .from(this.table.id.value)
      .leftJoin(
        ft.name,
        `${this.table.id.value}.${INTERNAL_COLUMN_ID_NAME}`,
        `${ft.name}.${CollaboratorForeignTable.RECORD_ID}`,
      )
      .groupBy(`${ft.name}.${CollaboratorForeignTable.RECORD_ID}`)
      .count('* as value')
      .as(fta)

    this.qb
      .from(subQuery)
      .select(
        `${fta}.${CollaboratorForeignTable.USER_ID} as key`,
        `${fta}.value`,
        this.knex.raw(
          `json_object(
            '${username.fieldNames[0]}', ${tableName}.${username.fieldNames[0]},
            '${avatar.fieldNames[0]}', ${tableName}.${avatar.fieldNames[0]},
            '${color.fieldNames[0]}', ${tableName}.${color.fieldNames[0]}
          ) as meta`,
        ),
      )
      .leftJoin(tableName, `${tableName}.${id.fieldNames[0]}`, `${fta}.${CollaboratorForeignTable.USER_ID}`)
  }
  min(field: MinField): void {
    throw new Error('Method not implemented.')
  }
  max(field: MaxField): void {
    throw new Error('Method not implemented.')
  }
}

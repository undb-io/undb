/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type {
  AttachmentFieldValue,
  AutoIncrementFieldValue,
  AverageFieldValue,
  BoolFieldValue,
  CollaboratorFieldValue,
  ColorFieldValue,
  CountFieldValue,
  CreatedAtFieldValue,
  CreatedByFieldValue,
  CurrencyFieldValue,
  DateFieldValue,
  DateRangeFieldValue,
  EmailFieldValue,
  IClsService,
  IFieldValueVisitor,
  IdFieldValue,
  JsonFieldValue,
  LookupFieldValue,
  MaxFieldValue,
  MinFieldValue,
  MultiSelectFieldValue,
  NumberFieldValue,
  ParentFieldValue,
  QRCodeFieldValue,
  RatingFieldValue,
  ReferenceFieldValue,
  SelectFieldValue,
  StringFieldValue,
  SumFieldValue,
  TableSchemaIdMap,
  TreeFieldValue,
  UpdatedAtFieldValue,
  UpdatedByFieldValue,
  UrlFieldValue,
} from '@undb/core'
import {
  CollaboratorField,
  INTERNAL_COLUMN_CREATED_BY_NAME,
  INTERNAL_COLUMN_UPDATED_BY_NAME,
  ParentField,
  ReferenceField,
  TreeField,
} from '@undb/core'
import { Attachment } from '../../entity/attachment.js'
import { Table } from '../../entity/table.js'
import {
  AdjacencyListTable,
  ClosureTable,
  CollaboratorForeignTable,
} from '../../underlying-table/underlying-foreign-table.js'
import { BaseEntityManager } from '../base-entity-manager.js'

export class RecordValueSqliteMutationVisitor extends BaseEntityManager implements IFieldValueVisitor {
  #data: Record<string, Knex.Value> = {}

  private setData(fieldId: string, value: Knex.Value): void {
    this.#data[fieldId] = value
  }

  public get data() {
    return this.#data
  }

  constructor(
    private readonly cls: IClsService,
    private readonly tableId: string,
    private readonly fieldId: string,
    private readonly recordId: string,
    private readonly isNew: boolean,
    private readonly schema: TableSchemaIdMap,
    em: EntityManager,
  ) {
    super(em)
    const userId = this.cls.get('user.userId')
    this.setData(INTERNAL_COLUMN_UPDATED_BY_NAME, userId)
  }
  id(value: IdFieldValue): void {}
  createdAt(value: CreatedAtFieldValue): void {}
  createdBy(value: CreatedByFieldValue): void {
    if (this.isNew) {
      const userId = this.cls.get('user.userId')
      this.setData(INTERNAL_COLUMN_CREATED_BY_NAME, userId)
    }
  }
  updatedAt(value: UpdatedAtFieldValue): void {}
  updatedBy(value: UpdatedByFieldValue): void {
    const userId = this.cls.get('user.userId')
    this.setData(INTERNAL_COLUMN_CREATED_BY_NAME, userId)
  }
  autoIncrement(value: AutoIncrementFieldValue): void {}

  string(value: StringFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  email(value: EmailFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  qrcode(value: QRCodeFieldValue): void {}
  url(value: UrlFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  json(value: JsonFieldValue): void {
    this.setData(this.fieldId, JSON.stringify(value.value))
  }
  color(value: ColorFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  number(value: NumberFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  rating(value: RatingFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  currency(value: CurrencyFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  bool(value: BoolFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  date(value: DateFieldValue): void {
    this.setData(this.fieldId, value.unpack()?.toISOString() ?? null)
  }
  dateRange(value: DateRangeFieldValue): void {
    this.setData(this.fieldId + '_from', value.from.into(null)?.toISOString() ?? null)
    this.setData(this.fieldId + '_to', value.to.into(null)?.toISOString() ?? null)
  }
  select(value: SelectFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  multiSelect(value: MultiSelectFieldValue): void {
    this.setData(this.fieldId, JSON.stringify(value.unpack()))
  }
  attachment(value: AttachmentFieldValue): void {
    this.addJobs(async () => {
      await this.em.nativeDelete(Attachment, { recordId: this.recordId, fieldId: this.fieldId })
      const attachments = value
        .unpack()
        .map((item) => new Attachment(this.em.getReference(Table, this.tableId), this.fieldId, this.recordId, item))
      this.em.persist(attachments)
    })
  }
  collaborator(value: CollaboratorFieldValue): void {
    const field = this.schema.get(this.fieldId)
    if (!(field instanceof CollaboratorField)) {
      return
    }

    const knex = this.em.getKnex()
    const ft = new CollaboratorForeignTable(this.tableId, field.id.value)

    const query = knex
      .queryBuilder()
      .table(ft.name)
      .delete()
      .where(CollaboratorForeignTable.RECORD_ID, this.recordId)
      .toQuery()
    this.addQueries(query)

    const userIds = value.unpack()
    if (userIds?.length) {
      for (const userId of userIds) {
        const query = knex
          .queryBuilder()
          .table(ft.name)
          .insert({
            [CollaboratorForeignTable.RECORD_ID]: this.recordId,
            [CollaboratorForeignTable.USER_ID]: userId,
          })
          .toQuery()

        this.addQueries(query)
      }
    }
  }

  reference(value: ReferenceFieldValue): void {
    const field = this.schema.get(this.fieldId)
    if (!(field instanceof ReferenceField)) {
      return
    }

    const knex = this.em.getKnex()

    const underlyingTable = AdjacencyListTable.fromField(this.tableId, field)

    const query = knex
      .queryBuilder()
      .table(underlyingTable.name)
      .delete()
      .where(
        !!field.symmetricReferenceFieldId && !field.isOwner ? AdjacencyListTable.TO_ID : AdjacencyListTable.FROM_ID,
        this.recordId,
      )
      .toQuery()

    this.addQueries(query)

    const unpackedValue = value.unpack()
    if (unpackedValue?.length) {
      for (const recordId of unpackedValue) {
        const query = knex
          .queryBuilder()
          .table(underlyingTable.name)
          .insert({
            [!!field.symmetricReferenceFieldId && !field.isOwner
              ? AdjacencyListTable.FROM_ID
              : AdjacencyListTable.TO_ID]: recordId,
            [!!field.symmetricReferenceFieldId && !field.isOwner
              ? AdjacencyListTable.TO_ID
              : AdjacencyListTable.FROM_ID]: this.recordId,
          })
          .onConflict([AdjacencyListTable.FROM_ID, AdjacencyListTable.TO_ID])
          .merge()
          .toQuery()

        this.addQueries(query)
      }
    }
  }

  tree(value: TreeFieldValue): void {
    const field = this.schema.get(this.fieldId)
    if (!(field instanceof TreeField)) return

    const knex = this.em.getKnex()
    const closure = new ClosureTable(this.tableId, field)

    const children = value.unpack()

    this.addQueries(...closure.connect(knex, this.recordId, children ?? []))
  }

  parent(value: ParentFieldValue): void {
    const field = this.schema.get(this.fieldId)
    if (!(field instanceof ParentField)) return

    const parentId = value.unpack()

    const knex = this.em.getKnex()
    const closure = new ClosureTable(this.tableId, field)

    const moveParentQueries = closure.moveParent(knex, this.recordId, parentId)
    this.addQueries(...moveParentQueries)
  }
  count(value: CountFieldValue): void {}
  sum(value: SumFieldValue): void {}
  average(value: AverageFieldValue): void {}
  lookup(value: LookupFieldValue): void {}
  min(value: MinFieldValue): void {}
  max(value: MaxFieldValue): void {}
}

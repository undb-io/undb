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
  DateFieldValue,
  DateRangeFieldValue,
  EmailFieldValue,
  IClsService,
  IFieldValueVisitor,
  IdFieldValue,
  LookupFieldValue,
  NumberFieldValue,
  ParentFieldValue,
  RatingFieldValue,
  ReferenceFieldValue,
  SelectFieldValue,
  StringFieldValue,
  SumFieldValue,
  TableSchemaIdMap,
  TreeFieldValue,
  UpdatedAtFieldValue,
} from '@undb/core'
import { CollaboratorField, INTERNAL_COLUMN_CREATED_BY_NAME, ParentField, ReferenceField, TreeField } from '@undb/core'
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
  autoIncrement(value: AutoIncrementFieldValue): void {}

  string(value: StringFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  email(value: EmailFieldValue): void {
    this.setData(this.fieldId, value.unpack())
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
  bool(value: BoolFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  date(value: DateFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  dateRange(value: DateRangeFieldValue): void {
    this.setData(this.fieldId + '_from', value.from.into(null))
    this.setData(this.fieldId + '_to', value.to.into(null))
  }
  select(value: SelectFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  attachment(value: AttachmentFieldValue): void {
    this.addJobs(async () => {
      await this.em.nativeDelete(Attachment, { recordId: this.recordId })
      const attachments = value
        .unpack()
        .map((item) => new Attachment(this.em.getReference(Table, this.tableId), this.recordId, item))
      this.em.persist(attachments)
    })
  }
  collaborator(value: CollaboratorFieldValue): void {
    const field = this.schema.get(this.fieldId)
    if (!(field instanceof CollaboratorField)) {
      return
    }

    const knex = this.em.getKnex()
    const ft = new CollaboratorForeignTable(this.tableId, field)

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

    const underlyingTable = new AdjacencyListTable(this.tableId, field)

    const query = knex
      .queryBuilder()
      .table(underlyingTable.name)
      .delete()
      .where(AdjacencyListTable.FROM_ID, this.recordId)
      .toQuery()

    this.addQueries(query)

    const unpackedValue = value.unpack()
    if (unpackedValue?.length) {
      for (const recordId of unpackedValue) {
        const query = knex
          .queryBuilder()
          .table(underlyingTable.name)
          .insert({
            [AdjacencyListTable.TO_ID]: recordId,
            [AdjacencyListTable.FROM_ID]: this.recordId,
          })
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
}

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AutoIncrementFieldValue,
  BoolFieldValue,
  CreatedAtFieldValue,
  DateFieldValue,
  DateRangeFieldValue,
  IdFieldValue,
  IFieldValueVisitor,
  NumberFieldValue,
  ParentFieldValue,
  ReferenceFieldValue,
  SelectFieldValue,
  StringFieldValue,
  TableSchemaIdMap,
  TreeFieldValue,
  UpdatedAtFieldValue,
} from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME, ParentField, ReferenceField, TreeField } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { RecordValueData, RecordValueSqlitePrimitives } from '../../types/record-value-sqlite.type'
import { UnderlyingAdjacencyListTable, UnderlyingClosureTable } from '../../underlying-table/underlying-foreign-table'

export class RecordValueSqliteMutationVisitor implements IFieldValueVisitor {
  #data: RecordValueData = {}

  private setData(fieldId: string, value: RecordValueSqlitePrimitives): void {
    this.#data[fieldId] = value
  }

  public get data() {
    return this.#data
  }

  constructor(
    private readonly tableId: string,
    private readonly fieldId: string,
    private readonly recordId: string,
    private readonly schema: TableSchemaIdMap,
    private readonly em: EntityManager,
  ) {}
  public readonly queries: string[] = []

  private addQueries(...queries: string[]) {
    this.queries.push(...queries)
  }

  id(value: IdFieldValue): void {}
  createdAt(value: CreatedAtFieldValue): void {}
  updatedAt(value: UpdatedAtFieldValue): void {}
  autoIncrement(value: AutoIncrementFieldValue): void {}

  string(value: StringFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  number(value: NumberFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  bool(value: BoolFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  date(value: DateFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  dateRange(value: DateRangeFieldValue): void {
    this.setData(this.fieldId + '_from', value.from.into())
    this.setData(this.fieldId + '_to', value.to.into())
  }
  select(value: SelectFieldValue): void {
    this.setData(this.fieldId, value.unpack())
  }
  reference(value: ReferenceFieldValue): void {
    const field = this.schema.get(this.fieldId)
    if (!(field instanceof ReferenceField)) {
      return
    }

    const unpacked = value.unpack()
    this.setData(this.fieldId, unpacked == null ? unpacked : JSON.stringify(unpacked))

    const underlyingTable = new UnderlyingAdjacencyListTable(this.tableId, field)

    const query = this.em
      .getKnex()
      .queryBuilder()
      .table(underlyingTable.name)
      .delete()
      .where(UnderlyingAdjacencyListTable.ADJACENCY_LIST_PARENT_ID_FIELD, this.recordId)
      .toQuery()

    this.addQueries(query)

    const unpackedValue = value.unpack()
    if (unpackedValue?.length) {
      for (const recordId of unpackedValue) {
        const query = this.em
          .getKnex()
          .queryBuilder()
          .table(underlyingTable.name)
          .insert({
            [UnderlyingAdjacencyListTable.ADJACENCY_LIST_CHILD_ID_FIELD]: recordId,
            [UnderlyingAdjacencyListTable.ADJACENCY_LIST_PARENT_ID_FIELD]: this.recordId,
          })
          .toQuery()

        this.addQueries(query)
      }
    }
  }

  tree(value: TreeFieldValue): void {
    const field = this.schema.get(this.fieldId)
    if (!(field instanceof TreeField)) return

    const children = value.unpack()
    this.setData(this.fieldId, children == null ? children : JSON.stringify(children))

    const knex = this.em.getKnex()
    const closure = new UnderlyingClosureTable(this.tableId, field)

    const parentFieldId = field.parentFieldId?.value
    if (parentFieldId) {
      const parentField = this.schema.get(parentFieldId)
      if (parentField instanceof ParentField) {
        const clear = knex
          .queryBuilder()
          .table(this.tableId)
          .update(parentFieldId, null)
          .whereIn(
            INTERNAL_COLUMN_ID_NAME,
            knex
              .select(UnderlyingClosureTable.CLOSURE_TABLE_CHILD_ID_FIELD)
              .from(closure.name)
              .where(UnderlyingClosureTable.CLOSURE_TABLE_PARENT_ID_FIELD, this.recordId)
              .andWhere(UnderlyingClosureTable.CLOSURE_TABLE_DEPTH_FIELD, '>', 0),
          )
          .toQuery()

        this.addQueries(clear)

        if (children?.length) {
          const updateChildren = knex
            .queryBuilder()
            .table(this.tableId)
            .update(parentFieldId, this.recordId)
            .whereIn(INTERNAL_COLUMN_ID_NAME, children)
            .toQuery()
          this.addQueries(updateChildren)
        }
      }
    }

    this.addQueries(...closure.connect(knex, this.recordId, children ?? []))
  }

  parent(value: ParentFieldValue): void {
    const field = this.schema.get(this.fieldId)
    if (!(field instanceof ParentField)) return

    const parentId = value.unpack()
    this.setData(this.fieldId, parentId)

    const knex = this.em.getKnex()
    const closure = new UnderlyingClosureTable(this.tableId, field)
  }
}

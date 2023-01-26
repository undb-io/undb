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
import type { RecordValueData } from '../../types/record-value-sqlite.type'
import { AdjacencyListTable, ClosureTable } from '../../underlying-table/underlying-foreign-table'

export class RecordValueSqliteMutationVisitor implements IFieldValueVisitor {
  #data: RecordValueData = {}
  #jobs: Array<() => Promise<void>> = []

  private setData(fieldId: string, value: any): void {
    this.#data[fieldId] = value
  }

  public get data() {
    return this.#data
  }

  public get jobs() {
    return this.#jobs
  }

  constructor(
    private readonly tableId: string,
    private readonly fieldId: string,
    private readonly recordId: string,
    private readonly isNew: boolean,
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

    const knex = this.em.getKnex()

    const references = value.unpack()
    this.setData(this.fieldId, references?.length ? knex.raw('json_array(?)', [references]) : null)

    const underlyingTable = new AdjacencyListTable(this.tableId, field)

    const query = knex
      .queryBuilder()
      .table(underlyingTable.name)
      .delete()
      .where(AdjacencyListTable.PARENT_ID, this.recordId)
      .toQuery()

    this.addQueries(query)

    const unpackedValue = value.unpack()
    if (unpackedValue?.length) {
      for (const recordId of unpackedValue) {
        const query = knex
          .queryBuilder()
          .table(underlyingTable.name)
          .insert({
            [AdjacencyListTable.CHILD_ID]: recordId,
            [AdjacencyListTable.PARENT_ID]: this.recordId,
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
    this.setData(this.fieldId, children?.length ? knex.raw('json_array(?)', [children]) : null)

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
              .select(ClosureTable.CHILD_ID)
              .from(closure.name)
              .where(ClosureTable.PARENT_ID, this.recordId)
              .andWhere(ClosureTable.DEPTH, '=', 1),
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
    const closure = new ClosureTable(this.tableId, field)

    const treeFieldId = field.treeFieldId.value
    const treeField = this.schema.get(treeFieldId)

    if (treeField instanceof TreeField && !this.isNew) {
      const parentQuery = knex
        .queryBuilder()
        .select(ClosureTable.PARENT_ID)
        .from(closure.name)
        .where(ClosureTable.CHILD_ID, this.recordId)
        .andWhere(ClosureTable.DEPTH, 1)

      const nestQuery = knex
        .queryBuilder()
        .select(ClosureTable.CHILD_ID)
        .from(closure.name)
        .where(ClosureTable.PARENT_ID, parentQuery)
        .andWhere(ClosureTable.DEPTH, 1)
        .andWhereNot(ClosureTable.CHILD_ID, this.recordId)

      const query = knex
        .queryBuilder()
        .table(this.tableId)
        .update(
          treeFieldId,
          knex.raw(
            `
          CASE
            WHEN ? IS NULL THEN null
                           ELSE json_array(?)
            END`,
            [nestQuery, nestQuery],
          ),
        )
        .where(INTERNAL_COLUMN_ID_NAME, parentQuery)
        .toQuery()

      this.addQueries(query)
    }

    this.addQueries(...closure.moveParent(knex))
  }
}

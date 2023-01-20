import type {
  BoolFieldValue,
  DateFieldValue,
  DateRangeFieldValue,
  IFieldValueVisitor,
  NumberFieldValue,
  ReferenceFieldValue,
  SelectFieldValue,
  StringFieldValue,
  TableSchemaIdMap,
  TreeFieldValue,
} from '@egodb/core'
import { ReferenceField, TreeField } from '@egodb/core'
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
    const unpacked = value.unpack()
    this.setData(this.fieldId, unpacked == null ? unpacked : JSON.stringify(unpacked))

    const field = this.schema.get(this.fieldId)
    if (field instanceof ReferenceField) {
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
  }
  tree(value: TreeFieldValue): void {
    const unpacked = value.unpack()
    this.setData(this.fieldId, unpacked == null ? unpacked : JSON.stringify(unpacked))

    const field = this.schema.get(this.fieldId)
    if (field instanceof TreeField) {
      const knex = this.em.getKnex()
      const closure = new UnderlyingClosureTable(this.tableId, field)
      const childId = UnderlyingClosureTable.CLOSURE_TABLE_CHILD_ID_FIELD,
        parentId = UnderlyingClosureTable.CLOSURE_TABLE_PARENT_ID_FIELD,
        depth = UnderlyingClosureTable.CLOSURE_TABLE_DEPTH_FIELD

      const query = knex
        .queryBuilder()
        .table(closure.name)
        .delete()
        .where(UnderlyingAdjacencyListTable.ADJACENCY_LIST_PARENT_ID_FIELD, this.recordId)
        .toQuery()

      this.addQueries(query)

      const unpackedValue = value.unpack()

      const rootInsert = knex(closure.name)
        .insert({
          [childId]: this.recordId,
          [depth]: 0,
          [parentId]: this.recordId,
        })
        .toQuery()

      this.addQueries(rootInsert)

      if (unpackedValue?.length) {
        for (const recordId of unpackedValue) {
          const query = knex
            .raw(
              `
            insert into ${closure.name}(${parentId}, ${childId}, ${depth})
select p.${parentId}, c.${childId}, p.${depth}+c.${depth}+1
  from ${closure.name} as p, ${closure.name} as c
 where p.${childId}='${this.recordId}' and c.${parentId}='${recordId} on conflict replace'
 `,
            )
            .toQuery()

          this.addQueries(query)
        }
      }
    }
  }
}

import {
  ID_TYPE,
  RatingField,
  SelectField,
  type AutoIncrementField,
  type CreatedAtField,
  type CreatedByField,
  type Field,
  type IFieldVisitor,
  type IdField,
  type NumberField,
  type ReferenceField,
  type RollupField,
  type StringField,
  type TableDo,
  type UpdatedAtField,
  type UpdatedByField,
} from "@undb/table"
import type { QueryCreator, SelectExpression } from "kysely"
import type { IQueryBuilder } from "../qb"
import { JoinTable } from "../underlying/reference/join-table"
import { UnderlyingTable } from "../underlying/underlying-table"
import { getRollupFn } from "../underlying/underlying-table.util"

export class RecordQueryCreatorVisitor implements IFieldVisitor {
  constructor(
    private readonly qb: IQueryBuilder,
    private readonly table: TableDo,
    private readonly foreignTables: Map<string, TableDo>,
    private readonly visibleFields: Field[],
  ) {}

  private creator: QueryCreator<any> | null = null

  create() {
    // handle select fields
    const referenceFields = this.table.schema.getReferenceFields(this.visibleFields)
    for (const referenceField of referenceFields) {
      referenceField.accept(this)
    }
    return this.creator ?? this.qb
  }

  id(field: IdField): void {}
  autoIncrement(field: AutoIncrementField): void {}
  createdAt(field: CreatedAtField): void {}
  createdBy(field: CreatedByField): void {}
  updatedAt(field: UpdatedAtField): void {}
  updatedBy(field: UpdatedByField): void {}
  string(field: StringField): void {}
  number(field: NumberField): void {}
  rating(field: RatingField): void {}
  select(field: SelectField): void {}
  reference(field: ReferenceField): void {
    const foreignTable = this.foreignTables.get(field.foreignTableId)
    if (!foreignTable) {
      return
    }

    const rollupFields = field.getRollupFields(this.visibleFields)

    const underlyingForiegnTable = new UnderlyingTable(foreignTable)

    const joinTable = new JoinTable(this.table, field)
    const name = joinTable.getTableName()
    const valueField = joinTable.getValueFieldId()
    const symmetricField = joinTable.getSymmetricValueFieldId()

    const visible = this.visibleFields.some((f) => f.id.equals(field.id))
    const displayFields = visible ? foreignTable.schema.getDisplayFields() : []

    this.creator = (this.creator || this.qb).with(field.id.value, (db) =>
      db
        .selectFrom(name)
        .innerJoin(
          underlyingForiegnTable.name,
          `${name}.${symmetricField}`,
          `${underlyingForiegnTable.name}.${ID_TYPE}`,
        )
        .select(
          (sb) =>
            [
              `${name}.${valueField} as ${ID_TYPE}`,
              visible ? sb.fn("json_group_array", [sb.ref(`${name}.${symmetricField}`)]).as(field.id.value) : undefined,
              // select display fields for reference
              ...displayFields.map((f) =>
                sb.fn("json_group_array", [sb.ref(`${underlyingForiegnTable.name}.${f.id.value}`)]).as(f.id.value),
              ),
              ...rollupFields.map((rollupField) =>
                sb
                  .fn(getRollupFn(rollupField.fn), [
                    sb.ref(`${underlyingForiegnTable.name}.${rollupField.rollupFieldId}`),
                  ])
                  .as(rollupField.id.value),
              ),
            ].filter(Boolean) as SelectExpression<any, any>[],
        )
        .groupBy(`${name}.${valueField}`),
    )
  }
  rollup(field: RollupField): void {}
}

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
import type { SelectQueryBuilder } from "kysely"

export class RecordReferenceVisitor implements IFieldVisitor {
  constructor(
    private qb: SelectQueryBuilder<any, any, any>,
    private readonly table: TableDo,
  ) {}

  join(fields: Field[]) {
    for (const field of fields) {
      field.accept(this)
    }
    return this.qb
  }

  id(field: IdField): void {
    throw new Error("Method not implemented.")
  }
  autoIncrement(field: AutoIncrementField): void {
    throw new Error("Method not implemented.")
  }
  createdAt(field: CreatedAtField): void {
    throw new Error("Method not implemented.")
  }
  createdBy(field: CreatedByField): void {
    throw new Error("Method not implemented.")
  }
  updatedAt(field: UpdatedAtField): void {
    throw new Error("Method not implemented.")
  }
  updatedBy(field: UpdatedByField): void {
    throw new Error("Method not implemented.")
  }
  string(field: StringField): void {
    throw new Error("Method not implemented.")
  }
  number(field: NumberField): void {
    throw new Error("Method not implemented.")
  }
  rating(field: RatingField): void {
    throw new Error("Method not implemented.")
  }
  select(field: SelectField): void {
    throw new Error("Method not implemented.")
  }
  reference(field: ReferenceField): void {
    this.qb = this.qb.leftJoin(field.id.value, `${this.table.id.value}.${ID_TYPE}`, `${field.id.value}.${ID_TYPE}`)
  }
  rollup(field: RollupField): void {
    throw new Error("Method not implemented.")
  }
}

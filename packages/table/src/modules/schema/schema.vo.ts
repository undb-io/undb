import { Option, ValueObject } from '@undb/domain'
import { objectify } from 'radash'
import { z } from 'zod'
import type { ICreateSchemaDTO } from './dto'
import type { ISchemaDTO } from './dto/schema.dto'
import type { FieldId } from './fields/field-id.vo'
import { FieldFactory } from './fields/field.factory'
import type { Field } from './fields/field.type'
import type { SchemaMap } from './schema.type'

export class Schema extends ValueObject {
  private constructor(public readonly fields: Field[]) {
    super(fields)
  }

  static create(dto: ICreateSchemaDTO): Schema {
    const fields = dto.map((field) => FieldFactory.create(field))
    return new Schema(fields)
  }

  static fromJSON(dto: ISchemaDTO): Schema {
    const fields = dto.map((field) => FieldFactory.fromJSON(field))
    return new Schema(fields)
  }

  *[Symbol.iterator]() {
    yield* this.fields
  }

  get fieldMapById(): SchemaMap {
    return new Map(this.fields.map((field) => [field.id.value, field]))
  }

  get valuesSchema() {
    const schema = objectify(
      this.fields,
      (f) => f.id.value,
      (f) => f.valueSchema
    )

    return z.object(schema)
  }

  toJSON(): ISchemaDTO {
    return this.fields.map((field) => field.toJSON())
  }

  getFieldById(fieldId: FieldId): Option<Field> {
    const field = this.fields.find((f) => f.id.equals(fieldId))
    return Option(field)
  }
}

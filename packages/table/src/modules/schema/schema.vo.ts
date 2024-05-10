import { Option, ValueObject } from '@undb/domain'
import type { ICreateSchemaDTO } from './dto'
import type { ISchemaDTO } from './dto/schema.dto'
import type { FieldId } from './fields/field-id.vo'
import { FieldFactory } from './fields/field.factory'
import type { Field } from './fields/field.type'

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

  toJSON(): ISchemaDTO {
    return this.fields.map((field) => field.toJSON())
  }

  getFieldById(fieldId: FieldId): Option<Field> {
    const field = this.fields.find((f) => f.id.equals(fieldId))
    return Option(field)
  }
}

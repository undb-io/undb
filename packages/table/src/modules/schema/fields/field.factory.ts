import { type ICreateFieldDTO } from "./dto/create-field.dto"
import type { IFieldDTO } from "./dto/field.dto"
import type { Field } from "./field.type"
import { NumberField } from "./variants/number-field/number-field.vo"
import { StringField } from "./variants/string-field/string-field.vo"

export class FieldFactory {
  static fromJSON(dto: IFieldDTO): Field {
    switch (dto.type) {
      case "string":
        return new StringField(dto)
      case "number":
        return new NumberField(dto)

      default:
        throw new Error("Invalid field type")
    }
  }

  static create(dto: ICreateFieldDTO): Field {
    switch (dto.type) {
      case "number":
        return NumberField.create(dto)
      case "string":
        return StringField.create(dto)

      default:
        throw new Error("Invalid field type")
    }
  }
}

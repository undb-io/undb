import { match } from "ts-pattern"
import { UpdatedAtField } from ".."
import type { ICreateFieldDTO } from "./dto/create-field.dto"
import type { IFieldDTO } from "./dto/field.dto"
import type { Field } from "./field.type"
import { AutoIncrementField } from "./variants/autoincrement-field"
import { CreatedAtField } from "./variants/created-at-field"
import { CreatedByField } from "./variants/created-by-field"
import { IdField } from "./variants/id-field"
import { NumberField } from "./variants/number-field/number-field.vo"
import { StringField } from "./variants/string-field/string-field.vo"

export class FieldFactory {
  static fromJSON(dto: IFieldDTO): Field {
    return match(dto)
      .with({ type: "string" }, (dto) => new StringField(dto))
      .with({ type: "number" }, (dto) => new NumberField(dto))
      .with({ type: "id" }, (dto) => new IdField(dto))
      .with({ type: "createdAt" }, (dto) => new CreatedAtField(dto))
      .with({ type: "createdBy" }, (dto) => new CreatedByField(dto))
      .with({ type: "autoIncrement" }, (dto) => new AutoIncrementField(dto))
      .with({ type: "updatedAt" }, (dto) => new UpdatedAtField(dto))
      .exhaustive()
  }

  static create(dto: ICreateFieldDTO): Field {
    return match(dto)
      .with({ type: "string" }, (dto) => StringField.create(dto))
      .with({ type: "number" }, (dto) => NumberField.create(dto))
      .otherwise(() => {
        throw new Error("Field type creation not supported")
      })
  }
}

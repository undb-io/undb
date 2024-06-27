import { match } from "ts-pattern"
import type { ICreateFieldDTO } from "./dto/create-field.dto"
import type { IFieldDTO } from "./dto/field.dto"
import type { Field } from "./field.type"
import { AttachmentField } from "./variants/attachment-field"
import { AutoIncrementField } from "./variants/autoincrement-field"
import { CreatedAtField } from "./variants/created-at-field"
import { CreatedByField } from "./variants/created-by-field"
import { EmailField } from "./variants/email-field"
import { IdField } from "./variants/id-field"
import { NumberField } from "./variants/number-field/number-field.vo"
import { RatingField } from "./variants/rating-field/rating-field.vo"
import { ReferenceField } from "./variants/reference-field/reference-field.vo"
import { RollupField } from "./variants/rollup-field/rollup-field.vo"
import { SelectField } from "./variants/select-field/select-field.vo"
import { StringField } from "./variants/string-field/string-field.vo"
import { UpdatedAtField } from "./variants/updated-at-field/updated-at-field.vo"
import { UpdatedByField } from "./variants/updated-by-field/updated-by-field.vo"

export class FieldFactory {
  static fromJSON(dto: IFieldDTO): Field {
    return match(dto)
      .with({ type: "string" }, (dto) => new StringField(dto))
      .with({ type: "number" }, (dto) => new NumberField(dto))
      .with({ type: "rating" }, (dto) => new RatingField(dto))
      .with({ type: "id" }, (dto) => new IdField(dto))
      .with({ type: "createdAt" }, (dto) => new CreatedAtField(dto))
      .with({ type: "createdBy" }, (dto) => new CreatedByField(dto))
      .with({ type: "autoIncrement" }, (dto) => new AutoIncrementField(dto))
      .with({ type: "updatedAt" }, (dto) => new UpdatedAtField(dto))
      .with({ type: "updatedBy" }, (dto) => new UpdatedByField(dto))
      .with({ type: "reference" }, (dto) => new ReferenceField(dto))
      .with({ type: "rollup" }, (dto) => new RollupField(dto))
      .with({ type: "select" }, (dto) => new SelectField(dto))
      .with({ type: "email" }, (dto) => new EmailField(dto))
      .with({ type: "attachment" }, (dto) => new AttachmentField(dto))
      .exhaustive()
  }

  static create(dto: ICreateFieldDTO): Field {
    return match(dto)
      .with({ type: "string" }, (dto) => StringField.create(dto))
      .with({ type: "number" }, (dto) => NumberField.create(dto))
      .with({ type: "rating" }, (dto) => RatingField.create(dto))
      .with({ type: "reference" }, (dto) => ReferenceField.create(dto))
      .with({ type: "rollup" }, (dto) => RollupField.create(dto))
      .with({ type: "select" }, (dto) => SelectField.create(dto))
      .with({ type: "email" }, (dto) => EmailField.create(dto))
      .with({ type: "attachment" }, (dto) => AttachmentField.create(dto))
      .otherwise(() => {
        throw new Error("Field type creation not supported")
      })
  }
}

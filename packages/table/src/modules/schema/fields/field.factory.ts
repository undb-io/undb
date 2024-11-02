import { match } from "ts-pattern"
import { UrlField } from "."
import type { TableDo } from "../../../table.do"
import type { ICreateFieldDTO } from "./dto/create-field.dto"
import type { IFieldDTO } from "./dto/field.dto"
import type { Field } from "./field.type"
import { AttachmentField } from "./variants/attachment-field/attachment-field.vo"
import { AutoIncrementField } from "./variants/autoincrement-field/autoincrement-field.vo"
import { ButtonField } from "./variants/button-field/button-field.vo"
import { CheckboxField } from "./variants/checkbox-field/checkbox-field.vo"
import { CreatedAtField } from "./variants/created-at-field/created-at-field.vo"
import { CreatedByField } from "./variants/created-by-field/created-by-field.vo"
import { CurrencyField } from "./variants/currency-field"
import { DateField } from "./variants/date-field/date-field.vo"
import { DateRangeField } from "./variants/date-range-field/date-range-field.vo"
import { DurationField } from "./variants/duration-field/duration-field.vo"
import { EmailField } from "./variants/email-field/email-field.vo"
import { FormulaField } from "./variants/formula-field/formula-field.vo"
import { IdField } from "./variants/id-field/id-field.vo"
import { JsonField } from "./variants/json-field/json-field.vo"
import { LongTextField } from "./variants/long-text-field"
import { NumberField } from "./variants/number-field/number-field.vo"
import { PercentageField } from "./variants/percentage-field/percentage-field.vo"
import { RatingField } from "./variants/rating-field/rating-field.vo"
import { ReferenceField } from "./variants/reference-field/reference-field.vo"
import { RollupField } from "./variants/rollup-field/rollup-field.vo"
import { SelectField } from "./variants/select-field/select-field.vo"
import { StringField } from "./variants/string-field/string-field.vo"
import { UpdatedAtField } from "./variants/updated-at-field/updated-at-field.vo"
import { UpdatedByField } from "./variants/updated-by-field/updated-by-field.vo"
import { UserField } from "./variants/user-field/user-field.vo"

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
      .with({ type: "url" }, (dto) => new UrlField(dto))
      .with({ type: "attachment" }, (dto) => new AttachmentField(dto))
      .with({ type: "date" }, (dto) => new DateField(dto))
      .with({ type: "json" }, (dto) => new JsonField(dto))
      .with({ type: "checkbox" }, (dto) => new CheckboxField(dto))
      .with({ type: "user" }, (dto) => new UserField(dto))
      .with({ type: "longText" }, (dto) => new LongTextField(dto))
      .with({ type: "currency" }, (dto) => new CurrencyField(dto))
      .with({ type: "button" }, (dto) => new ButtonField(dto))
      .with({ type: "duration" }, (dto) => new DurationField(dto))
      .with({ type: "percentage" }, (dto) => new PercentageField(dto))
      .with({ type: "formula" }, (dto) => new FormulaField(dto))
      .with({ type: "dateRange" }, (dto) => new DateRangeField(dto))
      .exhaustive()
  }

  static create(table: TableDo, dto: ICreateFieldDTO): Field {
    return match(dto)
      .with({ type: "string" }, (dto) => StringField.create(dto))
      .with({ type: "number" }, (dto) => NumberField.create(dto))
      .with({ type: "rating" }, (dto) => RatingField.create(dto))
      .with({ type: "reference" }, (dto) => ReferenceField.create(dto))
      .with({ type: "rollup" }, (dto) => RollupField.create(dto))
      .with({ type: "select" }, (dto) => SelectField.create(dto))
      .with({ type: "email" }, (dto) => EmailField.create(dto))
      .with({ type: "url" }, (dto) => UrlField.create(dto))
      .with({ type: "attachment" }, (dto) => AttachmentField.create(dto))
      .with({ type: "date" }, (dto) => DateField.create(dto))
      .with({ type: "json" }, (dto) => JsonField.create(dto))
      .with({ type: "checkbox" }, (dto) => CheckboxField.create(dto))
      .with({ type: "user" }, (dto) => UserField.create(dto))
      .with({ type: "longText" }, (dto) => LongTextField.create(dto))
      .with({ type: "currency" }, (dto) => CurrencyField.create(dto))
      .with({ type: "button" }, (dto) => ButtonField.create(dto))
      .with({ type: "duration" }, (dto) => DurationField.create(dto))
      .with({ type: "percentage" }, (dto) => PercentageField.create(dto))
      .with({ type: "formula" }, (dto) => FormulaField.create(table, dto))
      .with({ type: "dateRange" }, (dto) => DateRangeField.create(dto))
      .otherwise(() => {
        throw new Error("Field type creation not supported")
      })
  }
}

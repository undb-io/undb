/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AttachmentField,
  AutoIncrementField,
  BoolField,
  ColorField,
  CountField,
  CreatedAtField,
  CreatedByField,
  DateField,
  DateRangeField,
  EmailField,
  IFieldVisitor,
  IdField,
  LookupField,
  NumberField,
  ParentField,
  RatingField,
  ReferenceField,
  SelectField,
  StringField,
  SumField,
  TreeField,
  UpdatedAtField,
} from '../field'
import type { AverageField } from '../field/average-field'
import type { CollaboratorField } from '../field/collaborator-field'

export abstract class AbstractReferenceFieldVisitor implements IFieldVisitor {
  id(field: IdField): void {}
  createdAt(field: CreatedAtField): void {}
  createdBy(field: CreatedByField): void {}
  updatedAt(field: UpdatedAtField): void {}
  attachment(field: AttachmentField): void {}
  autoIncrement(field: AutoIncrementField): void {}
  string(field: StringField): void {}
  email(field: EmailField): void {}
  color(field: ColorField): void {}
  number(field: NumberField): void {}
  bool(field: BoolField): void {}
  date(field: DateField): void {}
  dateRange(field: DateRangeField): void {}
  select(field: SelectField): void {}
  abstract reference(field: ReferenceField): void
  abstract tree(field: TreeField): void
  abstract parent(field: ParentField): void
  rating(field: RatingField): void {}
  count(field: CountField): void {}
  sum(field: SumField): void {}
  average(field: AverageField): void {}
  lookup(field: LookupField): void {}
  collaborator(field: CollaboratorField): void {}
}

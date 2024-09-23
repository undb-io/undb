import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { fieldId, FieldIdVo } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { UserEmpty, UserEqual } from "../abstractions/abstract-user-value.specification"
import { userFieldConstraint, UserFieldConstraint } from "./user-field-constraint.vo"
import { userFieldValue, UserFieldValue } from "./user-field-value.vo"
import { userFieldAggregate } from "./user-field.aggregate"
import {
  createUserFieldCondition,
  type IUserFieldCondition,
  type IUserFieldConditionSchema,
} from "./user-field.condition"

export const USER_TYPE = "user" as const

export const createUserFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(USER_TYPE),
  constraint: userFieldConstraint.optional(),
  defaultValue: userFieldValue,
})

export const createTablesUserFieldDTO = createUserFieldDTO

export type ICreateUserFieldDTO = z.infer<typeof createUserFieldDTO>
export const updateUserFieldDTO = createUserFieldDTO.setKey("id", fieldId)
export type IUpuserUserFieldDTO = z.infer<typeof updateUserFieldDTO>

export const userFieldDTO = baseFieldDTO.extend({
  type: z.literal(USER_TYPE),
  constraint: userFieldConstraint.optional(),
  defaultValue: userFieldValue,
})

export type IUserFieldDTO = z.infer<typeof userFieldDTO>

export class UserField extends AbstractField<UserFieldValue> {
  constructor(dto: IUserFieldDTO) {
    super(dto)
    if (dto.constraint) {
      this.constraint = Some(new UserFieldConstraint(dto.constraint))
    }
    if (dto.defaultValue) {
      this.defaultValue = new UserFieldValue(dto.defaultValue)
    }
  }

  static create(dto: ICreateUserFieldDTO) {
    return new UserField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
  }

  override type = USER_TYPE

  get #constraint(): UserFieldConstraint {
    return this.constraint.unwrapOrElse(() => new UserFieldConstraint({}))
  }

  override get valueSchema() {
    return this.#constraint.schema
  }

  override get mutateSchema() {
    return this.#constraint.mutateSchema
  }

  override getConstraintFromFormField(formField: FormFieldVO) {
    return this.#constraint.fromFormField(formField)
  }

  public get isSingle() {
    return this.#constraint.isSingle
  }

  public get isMultiple() {
    return !this.isSingle
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.user(this)
  }

  override getSpec(condition: IUserFieldCondition) {
    const spec = match(condition)
      .with({ op: "eq" }, ({ value }) => new UserEqual(value, this.id))
      .with({ op: "neq" }, ({ value }) => new UserEqual(value, this.id).not())
      .with({ op: "is_empty" }, () => new UserEmpty(this.id))
      .with({ op: "is_not_empty" }, () => new UserEmpty(this.id).not())
      .exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IUserFieldConditionSchema {
    return createUserFieldCondition(optionType)
  }

  override get aggregate() {
    return userFieldAggregate
  }

  override getMutationSpec(value: UserFieldValue): Option<RecordComositeSpecification> {
    return Some(new UserEqual(value.value, this.id))
  }
}

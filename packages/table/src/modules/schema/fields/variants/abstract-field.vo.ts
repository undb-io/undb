import { Option, ValueObject } from "@undb/domain"
import { ZodUndefined, z, type ZodSchema } from "zod"
import type {
  INotRecordComositeSpecification,
  IRecordComositeSpecification,
  RecordComositeSpecification,
} from "../../../records/record/record.composite-specification"
import type { IFieldCondition, MaybeFieldConditionWithFieldId } from "../condition/field-condition.type"
import type { IFieldDTO } from "../dto/field.dto"
import { FieldIdVo, fieldId, type FieldId } from "../field-id.vo"
import { FieldNameVo, fieldName } from "../field-name.vo"
import type { FieldType } from "../field.type"
import { isFieldSortable } from "../field.util"
import type { IFieldVisitor } from "../field.visitor"
import type { IAutoIncrementFieldConditionSchema } from "./autoincrement-field/autoincrement-field.condition"
import type { ICreatedAtFieldConditionSchema } from "./created-at-field"
import type { IIdFieldConditionSchema } from "./id-field/id-field.condition"
import type { INumberFieldConditionSchema } from "./number-field"
import type { IStringFieldConditionSchema } from "./string-field"
import type { IUpdatedAtFieldConditionSchema } from "./updated-at-field"

export const createBaseFieldDTO = z.object({
  id: fieldId.optional(),
  name: fieldName,
})

export type ICreateBaseFieldDTO = z.infer<typeof createBaseFieldDTO>

export const baseFieldDTO = z.object({
  id: fieldId,
  name: fieldName,
  required: z.boolean().optional(),
})

export type IBaseFieldDTO = z.infer<typeof baseFieldDTO>

export abstract class AbstractField<V extends ValueObject> {
  id!: FieldId
  name!: FieldNameVo

  constructor(dto: IBaseFieldDTO) {
    this.id = new FieldIdVo(dto.id)
    this.name = new FieldNameVo(dto.name)
    this.required = dto.required
  }

  abstract type: FieldType
  /**
   * whether the field value is controlled by system
   */
  protected system = false
  public get isSystem() {
    return this.system
  }

  public get isMutable() {
    return !this.isSystem
  }

  #required: boolean | undefined = undefined
  get required() {
    return this.system ? false : this.#required
  }
  set required(value: boolean | undefined) {
    if (this.system) {
      return
    }

    this.#required = value
  }

  protected abstract get valueSchema(): ZodSchema
  validate(value: V) {
    return this.valueSchema.safeParse(value.unpack())
  }

  abstract getSpec(condition: IFieldCondition): Option<IRecordComositeSpecification | INotRecordComositeSpecification>

  abstract accept(visitor: IFieldVisitor): void

  protected abstract getConditionSchema<OptionType extends z.ZodTypeAny>(
    optionType: OptionType,
  ):
    | IIdFieldConditionSchema
    | IStringFieldConditionSchema
    | INumberFieldConditionSchema
    | ICreatedAtFieldConditionSchema
    | IUpdatedAtFieldConditionSchema
    | IAutoIncrementFieldConditionSchema

  validateCondition<OptionType extends z.ZodTypeAny>(
    condition: MaybeFieldConditionWithFieldId,
    optionType: OptionType,
  ) {
    return this.getConditionSchema(optionType).safeParse(condition)
  }

  isOpHasValue(op: string) {
    const hasValue =
      this.getConditionSchema(z.any()).options.find((o) => o.shape.op.value === op)?.shape.value._def.typeName !==
      ZodUndefined.name

    return hasValue
  }

  abstract updateValue(value: V): Option<RecordComositeSpecification>

  get conditionOps() {
    return this.getConditionSchema(z.any()).options.map((o) => o.shape.op.value)
  }

  get sortable(): boolean {
    return isFieldSortable(this.type)
  }

  toJSON(): IFieldDTO {
    return {
      id: this.id.value,
      name: this.name.value,
      type: this.type,
      required: this.required,
    }
  }
}

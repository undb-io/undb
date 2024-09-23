import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { FormFieldVO } from "../../../../forms/form/form-field.vo"
import type { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { FieldIdVo, fieldId } from "../../field-id.vo"
import type { IFieldVisitor } from "../../field.visitor"
import { AbstractField, baseFieldDTO, createBaseFieldDTO } from "../abstract-field.vo"
import { AttachmentFieldConstraint, attachmentFieldConstraint } from "./attachment-field-constraint.vo"
import { AttachmentFieldValue, mutateAttachmentFieldValueSchema } from "./attachment-field-value.vo"
import { attachmentFieldAggregate } from "./attachment-field.aggregate"
import {
  createAttachmentFieldCondition,
  type IAttachmentFieldCondition,
  type IAttachmentFieldConditionSchema,
} from "./attachment-field.condition"
import { AttachmentEmpty, AttachmentEqual } from "./attachment-field.specification"

export const ATTACHMENT_TYPE = "attachment" as const

export const createAttachmentFieldDTO = createBaseFieldDTO.extend({
  type: z.literal(ATTACHMENT_TYPE),
  constraint: attachmentFieldConstraint.optional(),
})

export const createTablesAttachmentFieldDTO = createAttachmentFieldDTO

export type ICreateAttachmentFieldDTO = z.infer<typeof createAttachmentFieldDTO>

export const updateAttachmentFieldDTO = createAttachmentFieldDTO.setKey("id", fieldId)
export type IUpdateAttachmentFieldDTO = z.infer<typeof updateAttachmentFieldDTO>

export const attachmentFieldDTO = baseFieldDTO.extend({
  type: z.literal(ATTACHMENT_TYPE),
  constraint: attachmentFieldConstraint.optional(),
})

export type IAttachmentFieldDTO = z.infer<typeof attachmentFieldDTO>

export class AttachmentField extends AbstractField<AttachmentFieldValue, AttachmentFieldConstraint> {
  constructor(dto: IAttachmentFieldDTO) {
    super(dto)
    if (dto.constraint) {
      this.constraint = Some(new AttachmentFieldConstraint(dto.constraint))
    }
  }

  static create(dto: ICreateAttachmentFieldDTO) {
    const field = new AttachmentField({ ...dto, id: FieldIdVo.fromStringOrCreate(dto.id).value })
    return field
  }

  override type = ATTACHMENT_TYPE

  override get valueSchema() {
    return this.constraint.unwrapOrElse(() => new AttachmentFieldConstraint({})).schema
  }

  override get mutateSchema() {
    return Some(mutateAttachmentFieldValueSchema)
  }

  get #constraint(): AttachmentFieldConstraint {
    return this.constraint.unwrapOrElse(() => new AttachmentFieldConstraint({}))
  }

  override getConstraintFromFormField(formField: FormFieldVO) {
    return this.#constraint.fromFormField(formField)
  }

  override accept(visitor: IFieldVisitor): void {
    visitor.attachment(this)
  }

  override getSpec(condition: IAttachmentFieldCondition) {
    const spec = match(condition)
      .with({ op: "is_empty" }, () => new AttachmentEmpty(this.id))
      .with({ op: "is_not_empty" }, () => new AttachmentEmpty(this.id).not())
      .exhaustive()

    return Option(spec)
  }

  protected override getConditionSchema(optionType: z.ZodTypeAny): IAttachmentFieldConditionSchema {
    return createAttachmentFieldCondition(optionType)
  }

  override getMutationSpec(value: AttachmentFieldValue): Option<RecordComositeSpecification> {
    return Some(new AttachmentEqual(value.value, this.id))
  }

  override get aggregate() {
    return attachmentFieldAggregate
  }

  public get max() {
    return this.constraint.mapOr(Infinity, (c) => c.props.max ?? Infinity)
  }
}

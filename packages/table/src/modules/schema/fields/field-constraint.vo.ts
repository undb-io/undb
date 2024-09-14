import { Option, ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import type { FormFieldVO } from "../../forms/form/form-field.vo"

export const baseFieldConstraint = z.object({
  required: z.boolean().optional(),
})

export type IBaseFieldConstraint = z.infer<typeof baseFieldConstraint>

export abstract class FieldConstraintVO<C extends IBaseFieldConstraint = any> extends ValueObject<C> {
  public get required() {
    return !!this.props.required
  }

  abstract get schema(): z.ZodTypeAny
  abstract get mutateSchema(): Option<z.ZodTypeAny>
  abstract fromFormField(formField: FormFieldVO): this
}

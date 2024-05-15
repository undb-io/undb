import type { ISpecVisitor } from "@undb/domain"
import type { INumberFieldValueVisitor } from "../../schema"
import type { IIdFieldValueVisitor } from "../../schema/fields/variants/id-field"
import type { IStringFieldValueVisitor } from "../../schema/fields/variants/string-field/string-field-value.visitor"

export type IRecordVisitor = IStringFieldValueVisitor & INumberFieldValueVisitor & IIdFieldValueVisitor & ISpecVisitor

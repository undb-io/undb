import type { ISpecVisitor } from '@undb/domain'
import type { IStringFieldValueVisitor } from '../../schema/fields/variants/string-field/string-field-value.visitor'

export interface IRecordVisitor extends IStringFieldValueVisitor, ISpecVisitor {}

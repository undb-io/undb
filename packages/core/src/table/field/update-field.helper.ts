import { and } from '@undb/domain'
import { isArray, isBoolean, isNull, isNumber, isString } from 'lodash-es'
import type { Option as O } from 'oxide.ts'
import { OptionKey } from '../option/option-key.vo.js'
import { Option } from '../option/option.js'
import { Options } from '../option/options.js'
import type { TableCompositeSpecificaiton } from '../specifications/index.js'
import type { BaseField } from './field.base.js'
import type { IUpdateFieldSchema, SelectFieldTypes } from './field.type.js'
import { canDisplay, isControlledFieldType } from './field.util.js'
import { CurrencySymbol } from './fields/currency/currency-symbol.vo.js'
import type { ReferenceField } from './fields/reference/reference-field.js'
import { WithAggregateFieldId } from './specifications/aggregate-field.specification.js'
import { WithFieldDescription, WithFieldDisplay, WithFieldName } from './specifications/base-field.specification.js'
import { WithCurrencySymbol } from './specifications/currency-field.specification.js'
import { WithFormat, WithTimeFormat } from './specifications/date-field.specification.js'
import { WithFieldRequirement } from './specifications/field-constraints.specification.js'
import { WithNewFieldType } from './specifications/field.specification.js'
import { WithReferenceFieldId } from './specifications/lookup-field.specification.js'
import { WithRatingMax } from './specifications/rating-field.specification.js'
import { WithDisplayFields, WithForeignTableId } from './specifications/reference-field.specification.js'
import { WithNewOption, WithOption, WithOptions, WithoutOption } from './specifications/select-field.specification.js'

export class UpdateFieldHelper {
  static updateField(fromField: BaseField, input: IUpdateFieldSchema): O<TableCompositeSpecificaiton> {
    const specs: TableCompositeSpecificaiton[] = []

    const typeChanged = input.type !== fromField.type
    if (typeChanged) {
      specs.push(new WithNewFieldType(fromField, input.type))
    }

    const id = fromField.id.value
    input.type ||= fromField.type
    const type = input.type

    if (isString(input.name)) {
      specs.push(WithFieldName.fromString(type, id, input.name))
    }
    if (isString(input.description)) {
      specs.push(WithFieldDescription.fromString(type, id, input.description))
    }
    if (isBoolean(input.required) && isControlledFieldType(type)) {
      specs.push(new WithFieldRequirement(type, id, input.required))
    }
    if (isBoolean(input.display) && canDisplay(type)) {
      specs.push(new WithFieldDisplay(type, id, input.display))
    }

    switch (type) {
      case 'date-range':
      case 'updated-at':
      case 'created-at':
      case 'date': {
        if (isString(input.format)) {
          specs.push(WithFormat.fromString(type, id, input.format))
        }
        if (isString(input.timeFormat) || isNull(input.timeFormat)) {
          specs.push(WithTimeFormat.from(type, id, input.timeFormat))
        }
        break
      }

      case 'currency': {
        if (isString(input.symbol)) {
          specs.push(new WithCurrencySymbol(type, id, new CurrencySymbol({ value: input.symbol })))
        }
        break
      }
      case 'count': {
        if (isString(input.referenceFieldId)) {
          specs.push(WithReferenceFieldId.fromString(type, id, input.referenceFieldId))
        }
        break
      }
      case 'lookup': {
        if (isString(input.referenceFieldId)) {
          specs.push(WithReferenceFieldId.fromString(type, id, input.referenceFieldId))
        }
        if (isArray(input.displayFieldIds)) {
          specs.push(WithDisplayFields.fromIds(type, id, input.displayFieldIds))
        }
        break
      }
      case 'sum':
      case 'average':
      case 'min': {
        if (isString(input.referenceFieldId)) {
          specs.push(WithReferenceFieldId.fromString(type, id, input.referenceFieldId))
        }
        if (isString(input.aggregateFieldId)) {
          specs.push(WithAggregateFieldId.fromString(type, id, input.aggregateFieldId))
        }
        break
      }
      // TODO: implement
      case 'select':
      case 'multi-select': {
        const optionsInput = input.options
        if (typeChanged) {
          if (isArray(optionsInput) && optionsInput.length > 0) {
            const options = optionsInput.map((option) => Option.create(option))
            specs.push(new WithOptions(type, fromField.id.value, new Options(options)))
          }
        } else {
          if (isArray(optionsInput) && optionsInput.length > 0) {
            const options = (fromField as SelectFieldTypes).options.optionsMap
            for (const option of optionsInput) {
              const existing = !!option.key && !!options.get(option.key)
              if (existing) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                specs.push(new WithOption(type, id, options.get(option.key!)!.updateOption(option)))
                continue
              }

              specs.push(new WithNewOption(type, id, Option.create(option)))
            }

            for (const [optionId] of options) {
              if (!optionsInput.some((o) => o.key === optionId)) {
                const optionKey = OptionKey.fromString(optionId)
                specs.push(new WithoutOption(type, id, optionKey))
              }
            }
          }
        }
        break
      }
      case 'reference':
      case 'tree':
      case 'parent': {
        if (type === 'reference') {
          if (isString(input.foreignTableId)) {
            const oldForeignTableId =
              fromField.type === 'reference' ? (fromField as ReferenceField).foreignTableId.into() : undefined
            specs.push(WithForeignTableId.fromString(type, id, input.foreignTableId, oldForeignTableId))
          }
        }
        if (isArray(input.displayFieldIds)) {
          specs.push(WithDisplayFields.fromIds(type, id, input.displayFieldIds))
        }
        break
      }
      case 'rating': {
        if (isNumber(input.max)) {
          specs.push(new WithRatingMax(type, id, input.max))
        }

        break
      }
      default:
        break
    }

    return and(...specs)
  }
}

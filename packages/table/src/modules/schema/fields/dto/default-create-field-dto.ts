import type { TranslationFunctions } from "@undb/i18n/client"
import { match } from "ts-pattern"
import type { PartialDeep } from "type-fest"
import type { ICreateFieldDTO } from "."
import type { TableDo } from "../../../../table.do"
import type { FieldType } from "../field.type"
import type { ICreateCurrencyFieldDTO } from "../variants/currency-field/currency-field.vo"

export function createDefaultFieldDTO(table: TableDo, type: FieldType, LL: TranslationFunctions) {
  const name = table.schema.getNextFieldName(LL.table.fieldTypes[type]())
  return match(type)
    .returnType<PartialDeep<ICreateFieldDTO>>()
    .with(
      "string",
      "number",
      "rating",
      "percentage",
      "duration",
      "longText",
      "email",
      "url",
      "checkbox",
      "json",
      "longText",
      (type) => {
        return {
          name,
          type,
          display: false,
          constraint: {
            required: false,
          },
          defaultValue: undefined,
        }
      },
    )
    .with("attachment", (type) => {
      return {
        name,
        type,
        display: false,
        constraint: {
          required: false,
        },
        defaultValue: undefined,
      }
    })
    .with("button", (type) => {
      return {
        name,
        type,
        option: {
          label: name,
        },
      }
    })
    .with("date", "dateRange", (type) => {
      return {
        name,
        type,
        display: false,
        constraint: {
          required: false,
        },
        option: {
          format: "yyyy-MM-dd",
          includeTime: false,
        },
        defaultValue: undefined,
      }
    })
    .with("user", (type) => {
      return {
        name,
        type,
        display: false,
        constraint: {
          max: 1,
        },
        defaultValue: undefined,
      }
    })
    .with("formula", (type) => {
      return {
        name,
        type,
        display: false,
      }
    })
    .with("rollup", (type) => {
      return {
        name,
        type,
        display: false,
      }
    })
    .with("reference", (type) => {
      return {
        name,
        type,
        display: false,
      }
    })
    .with("select", (type) => {
      return {
        name,
        type,
        display: false,
        constraint: {
          required: false,
          max: 1,
        },
        option: {
          options: [],
        },
        defaultValue: undefined,
      }
    })
    .with("currency", (type) => {
      return {
        name,
        type,
        display: false,
        defaultValue: undefined,
        option: {
          symbol: "$",
        },
      } satisfies ICreateCurrencyFieldDTO
    })
    .otherwise((type) => {
      throw new Error(`Unsupported field type: ${type}`)
    })
}

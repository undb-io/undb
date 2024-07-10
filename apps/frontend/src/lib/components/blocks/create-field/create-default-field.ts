import { FieldIdVo, type FieldType, type ICreateFieldDTO, type TableDo } from "@undb/table"
import { match } from "ts-pattern"

export const createDefaultField = (table: TableDo, type: FieldType) =>
  match(type)
    .with("select", () => ({
      id: FieldIdVo.create().value,
      type: "select" as const,
      name: table.schema.getNextFieldName(),
      constraint: {
        max: undefined,
      },
      option: {
        options: [],
      },
    }))
    .otherwise(
      () =>
        ({
          id: FieldIdVo.create().value,
          type,
          name: table.schema.getNextFieldName(),
          display: false,
          constraint: {},
        }) as ICreateFieldDTO,
    )

import Parser from "@json2csv/plainjs/Parser.js"
import { ExportViewCommand } from "@undb/commands"
import { CommandBus } from "@undb/cqrs"
import { inject, singleton } from "@undb/di"
import { getIsFieldHasDisplayValue, IReadableRecordDTO, IReferenceFieldDisplayValue, TableDo } from "@undb/table"
import Elysia, { t } from "elysia"
import { mapEntries } from "radash"
import * as XLSX from "xlsx"

function mapRecord(table: TableDo, record: IReadableRecordDTO) {
  const schema = table.schema
  return mapEntries(record.values, (key, value) => {
    const field = schema.getFieldByIdOrName(String(key))
    if (field.isNone()) {
      return [key, value]
    }

    const f = field.unwrap()

    let computedValue = value
    if (getIsFieldHasDisplayValue(f.type)) {
      computedValue = record.displayValues?.[key] ?? undefined
    }

    if (Array.isArray(computedValue)) {
      computedValue = computedValue.join(", ")
    }

    if (f.type === "reference") {
      computedValue = computedValue as IReferenceFieldDisplayValue
      computedValue = Object.values(computedValue).join(", ")
    }

    return [key, computedValue]
  })
}

@singleton()
export class TableModule {
  constructor(
    @inject(CommandBus)
    private readonly commandBus: CommandBus,
  ) {}

  public route() {
    return new Elysia().get(
      "/api/tables/:tableId/views/:viewId/export",
      async (ctx) => {
        const type = ctx.query.type
        const { tableId, viewId } = ctx.params
        const { table, records } = await this.commandBus.execute<
          ExportViewCommand,
          { table: TableDo; records: IReadableRecordDTO[] }
        >(new ExportViewCommand({ tableId, viewId }))
        if (!records.length) {
          return
        }

        const values = records.map((r) => mapRecord(table, r))
        const keys = Object.keys(values[0])

        if (type === "csv") {
          const parser = new Parser()
          const csv = parser.parse(values)

          const response = new Response(csv)

          const fileName = `${table.name.value}.csv`
          response.headers.set("Content-Disposition", "attachment; filename=" + fileName)
          response.headers.set("Content-Type", "text/csv")

          return response
        } else if (type === "excel") {
          const wb = XLSX.utils.book_new()
          const xlsxData = XLSX.utils.json_to_sheet(values, {
            header: keys,
          })
          XLSX.utils.book_append_sheet(wb, xlsxData, table.name.value)
          const buffer: Buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

          const response = new Response(buffer)

          const fileName = `${table.name.value}.xlsx`

          response.headers.set("Content-Disposition", "attachment; filename=" + fileName)
          response.headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

          return response
        } else if (type === "json") {
          const response = new Response(JSON.stringify(values))

          const fileName = `${table.name.value}.json`

          response.headers.set("Content-Disposition", "attachment; filename=" + fileName)
          response.headers.set("Content-Type", "application/json")

          return response
        }
      },
      {
        params: t.Object({ tableId: t.String(), viewId: t.String() }),
        query: t.Object({ type: t.Enum({ excel: "excel", csv: "csv", json: "json" }) }),
      },
    )
  }
}

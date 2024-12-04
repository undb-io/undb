import { Base, BaseFactory } from "@undb/base"
import { DashboardFactory, type Dashboard, type ICreateDashboardDTO, type IDashboardWidget } from "@undb/dashboard"
import {
  flattenToCreateRecordDTO,
  RecordDO,
  TableDo,
  TableFactory,
  type ICreateFormDTO,
  type ICreateTablesDTO,
  type ICreateTablesSchemaDTO,
  type ICreateViewDTO,
  type IFlattenCreateRecordDTO,
} from "@undb/table"
import { getNextName } from "@undb/utils"
import { type IBaseTemplateDTO } from "./dto/template-schema.dto"

export type TemplateDTO = {
  base: Base
  tables: {
    table: TableDo
    records: RecordDO[]
  }[]
  dashboards: Dashboard[]
}[]

export class TemplateFactory {
  static create(template: IBaseTemplateDTO, baseNames: string[], spaceId: string): TemplateDTO {
    const result: TemplateDTO = []
    for (const [name, b] of Object.entries(template)) {
      const baseName = getNextName(baseNames, name)
      const base = BaseFactory.create({ name: baseName, spaceId })
      const baseId = base.id.value

      const tablesOrder = b.tablesOrder

      const dtos = Object.entries(b.tables).map(([name, table]) => {
        const schema = Object.entries(table.schema).map(([name, field]) => {
          return {
            ...field,
            name,
          }
        }) as ICreateTablesSchemaDTO

        const views = Object.entries(table.views ?? {}).map(([name, view]) => ({
          ...view,
          name,
        })) as ICreateViewDTO[]

        const forms = Object.entries(table.forms ?? {}).map(([name, form]) => ({
          ...form,
          name,
        })) as ICreateFormDTO[]

        const records = table.records?.map((record: IFlattenCreateRecordDTO) => flattenToCreateRecordDTO(record))

        return {
          id: table.id,
          baseId,
          name,
          schema,
          spaceId,
          fieldsOrder: table.fieldsOrder,

          views,
          forms,
          records,
        }
      }) as ICreateTablesDTO[]

      if (tablesOrder) {
        dtos.sort((a, b) => {
          const indexA = tablesOrder.indexOf(a.name)
          const indexB = tablesOrder.indexOf(b.name)
          if (indexA === -1) return 1
          if (indexB === -1) return -1
          return indexA - indexB
        })
      }

      const tables = new TableFactory().createMany(baseNames, base, dtos)

      const createDashboardDTOs = Object.entries(b.dashboards ?? {}).map(([name, dashboard]) => {
        const widgets = Object.entries(dashboard.widgets ?? {})
          .map(([name, widget]) => {
            const tableName = widget.tableName
            const table = tables.find(({ table }) => table.name.value === tableName)?.table
            if (!table) {
              return null
            }

            return {
              table: {
                id: table.id.value,
              },
              widget: { ...widget.widget, name },
            } satisfies IDashboardWidget
          })
          .filter((w) => !!w)

        return {
          ...dashboard,
          widgets,
          name,
          baseId,
          spaceId,
        }
      }) as ICreateDashboardDTO[]

      const dashboards = DashboardFactory.createMany(createDashboardDTOs)

      result.push({ base, tables, dashboards })
    }

    return result
  }
}

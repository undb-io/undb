import { Base, BaseFactory } from "@undb/base"
import {
  type ICreateFormDTO,
  type ICreateTablesDTO,
  type ICreateTablesSchemaDTO,
  type ICreateViewDTO,
  TableDo,
  TableFactory,
} from "@undb/table"
import { getNextName } from "@undb/utils"
import { type IBaseTemplateDTO } from "./dto/template.dto"

export class TemplateFactory {
  static create(template: IBaseTemplateDTO, baseNames: string[], spaceId: string): { base: Base; tables: TableDo[] }[] {
    const result: { base: Base; tables: TableDo[] }[] = []
    for (const [name, b] of Object.entries(template)) {
      const baseName = getNextName(baseNames, name)
      const base = BaseFactory.create({ name: baseName, spaceId })
      const baseId = base.id.value

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

        return {
          baseId,
          name,
          schema,
          spaceId,

          views,
          forms,
        }
      }) as ICreateTablesDTO[]

      const tables = TableFactory.createMany(baseNames, base, dtos)
      result.push({ base, tables })
    }

    return result
  }
}

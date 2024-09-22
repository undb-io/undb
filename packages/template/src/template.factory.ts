import { Base, BaseFactory } from "@undb/base"
import { type ICreateSchemaDTO, TableDo, TableFactory } from "@undb/table"
import { getNextName } from "@undb/utils"
import { type IBaseTemplateDTO } from "./dto/template.dto"

export class TemplateFactory {
  static create(template: IBaseTemplateDTO, baseNames: string[], spaceId: string): { base: Base; tables: TableDo[] }[] {
    const result: { base: Base; tables: TableDo[] }[] = []
    for (const [name, b] of Object.entries(template)) {
      const baseName = getNextName(baseNames, name)
      const base = BaseFactory.create({ name: baseName, spaceId })
      const baseId = base.id.value

      const tables: TableDo[] = []
      for (const [name, table] of Object.entries(b.tables)) {
        const schema = Object.entries(table.schema).map(([name, field]) => ({ ...field, name })) as ICreateSchemaDTO

        const t = TableFactory.create({ baseId, name, schema, spaceId })
        tables.push(t)
      }

      result.push({ base, tables })
    }

    return result
  }
}

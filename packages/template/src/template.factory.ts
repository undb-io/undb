import { Base, BaseFactory } from "@undb/base"
import {
  type ICreateFormDTO,
  type ICreateSchemaDTO,
  type ICreateTableDTO,
  type ICreateViewDTO,
  TableDo,
  TableFactory,
  TableIdVo,
} from "@undb/table"
import { getNextName } from "@undb/utils"
import { type IBaseTemplateDTO } from "./dto/template.dto"

class TemplateTableIdsMap {
  private map = new Map<string, string>()

  constructor(baseNames: string[], dto: IBaseTemplateDTO) {
    for (const [baseName, base] of Object.entries(dto)) {
      const name = getNextName(baseNames, baseName)
      for (const tableName of Object.keys(base.tables)) {
        this.map.set(this.generateKey(name, tableName), TableIdVo.create().value)
      }
    }
  }

  private generateKey(baseName: string, tableName: string): string {
    return `${baseName}-${tableName}`
  }

  set(baseName: string, tableName: string) {
    this.map.set(this.generateKey(baseName, tableName), TableIdVo.create().value)
  }

  get(baseName: string, tableName: string): string {
    return this.map.get(this.generateKey(baseName, tableName))!
  }
}

export class TemplateFactory {
  static create(template: IBaseTemplateDTO, baseNames: string[], spaceId: string): { base: Base; tables: TableDo[] }[] {
    const idsMap = new TemplateTableIdsMap(baseNames, template)

    const result: { base: Base; tables: TableDo[] }[] = []
    for (const [name, b] of Object.entries(template)) {
      const baseName = getNextName(baseNames, name)
      const base = BaseFactory.create({ name: baseName, spaceId })
      const baseId = base.id.value

      const dtos = Object.entries(b.tables).map(([name, table]) => {
        const schema = Object.entries(table.schema).map(([name, field]) => {
          if (field.type === "reference") {
            const option = field.option
            return {
              ...field,
              option: {
                ...option,
                foreignTableId: idsMap.get(baseName, option.foreignTable.tableName),
              },
              name,
            }
          } else {
            return {
              ...field,
              name,
            }
          }
        }) as ICreateSchemaDTO

        const views = Object.entries(table.views ?? {}).map(([name, view]) => ({
          ...view,
          name,
        })) as ICreateViewDTO[]

        const forms = Object.entries(table.forms ?? {}).map(([name, form]) => ({
          ...form,
          name,
        })) as ICreateFormDTO[]

        const id = idsMap.get(baseName, name)

        return {
          id,
          baseId,
          name,
          schema,
          spaceId,

          views,
          forms,
        }
      }) as ICreateTableDTO[]

      const tables = TableFactory.createMany(dtos)
      result.push({ base, tables })
    }

    return result
  }
}

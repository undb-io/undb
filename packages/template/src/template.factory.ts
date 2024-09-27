import { Base, BaseFactory } from "@undb/base"
import {
  flattenToCreateRecordDTO,
  type ICreateFormDTO,
  type ICreateTablesDTO,
  type ICreateTablesSchemaDTO,
  type ICreateViewDTO,
  type IFlattenCreateRecordDTO,
  RecordDO,
  TableDo,
  TableFactory,
} from "@undb/table"
import { getNextName } from "@undb/utils"
import { type IBaseTemplateDTO } from "./dto/template-schema.dto"

export class TemplateFactory {
  static create(
    template: IBaseTemplateDTO,
    baseNames: string[],
    spaceId: string,
  ): { base: Base; tables: { table: TableDo; records: RecordDO[] }[] }[] {
    const result: { base: Base; tables: { table: TableDo; records: RecordDO[] }[] }[] = []
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

        const records = table.records?.map((record: IFlattenCreateRecordDTO) => flattenToCreateRecordDTO(record))

        return {
          baseId,
          name,
          schema,
          spaceId,

          views,
          forms,
          records,
        }
      }) as ICreateTablesDTO[]

      const tables = TableFactory.createMany(baseNames, base, dtos)
      result.push({ base, tables })
    }

    return result
  }
}

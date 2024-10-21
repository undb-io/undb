import type { Base } from "@undb/base"
import { applyRules } from "@undb/domain"
import { getNextName } from "@undb/utils"
import { createTableDTO, type ICreateTableDTO, type ICreateTablesDTO, type ITableDTO } from "./dto"
import { TableCreatedEvent } from "./events"
import {
  FieldIdVo,
  RecordDO,
  ReferenceField,
  type ICreateFieldDTO,
  type ICreateReferenceFieldDTO,
  type ICreateSchemaDTO,
  type ICreateTablesReferenceFieldDTO,
} from "./modules"
import { FieldIdShouldBeUnique, FieldNameShouldBeUnique } from "./modules/schema/rules"
import { TableIdVo } from "./table-id.vo"
import { TableBuilder } from "./table.builder"
import type { TableDo } from "./table.do"

class TablesIdsMap {
  private map = new Map<string, string>()

  constructor(baseNames: string[], base: Base, dto: ICreateTablesDTO[]) {
    for (const table of dto) {
      const name = getNextName(baseNames, base.name.value)
      this.map.set(this.generateKey(name, table.name), TableIdVo.create().value)
    }
  }

  private generateKey(baseName: string, tableName: string): string {
    return `${baseName}-${tableName}`
  }

  set(baseName: string, tableName: string) {
    this.map.set(this.generateKey(baseName, tableName), TableIdVo.create().value)
  }

  get(baseName: string, tableName: string): string | undefined {
    return this.map.get(this.generateKey(baseName, tableName))
  }

  mustGet(baseName: string, tableName: string): string {
    const id = this.get(baseName, tableName)
    if (!id) {
      throw new Error("Cannot get id from table ids map")
    }
    return id
  }
}

export class TableFactory {
  private get builder() {
    return new TableBuilder()
  }

  create(dto: ICreateTableDTO): TableDo {
    dto = createTableDTO.parse(dto)
    const table = this.builder
      .setId(dto.id)
      .setBaseId(dto.baseId)
      .setSpaceId(dto.spaceId)
      .setName(dto.name)
      .createSchema(dto.schema)
      .createViews(dto.views)
      .createForms(dto.forms)
      .build()

    applyRules(new FieldNameShouldBeUnique(table.schema), new FieldIdShouldBeUnique(table.schema))

    // @ts-ignore - TODO: fix this
    table.addDomainEvent(new TableCreatedEvent({ table: table.toJSON() }))
    return table
  }

  // create many table inside a base
  createMany(
    baseNames: string[],
    base: Base,
    dtos: ICreateTablesDTO[],
    preview = false,
  ): { table: TableDo; records: RecordDO[] }[] {
    const ids = new TablesIdsMap(baseNames, base, dtos)
    const baseName = getNextName(baseNames, base.name.value)

    // only reference will create symmetric fields set
    const referenceIds = new Set<string>()
    const symmetricFields: ICreateTablesReferenceFieldDTO[] = []
    const tables = dtos.map((dto) => {
      const schema = dto.schema
        .map((field) => {
          if (field.type === "rollup") {
            return null
          }
          if (field.type === "reference") {
            if (!field.id) {
              field.id = FieldIdVo.create().value
            }

            // Symmetric field
            if (!field.option.foreignTable) {
              symmetricFields.push(field)
              return null
            }

            const foreignTableId = ids.mustGet(baseName, field.option.foreignTable.tableName)
            if (field.option.createSymmetricField) {
              referenceIds.add(field.id!)
            }
            return {
              ...field,
              option: {
                ...field.option,
                foreignTableId: foreignTableId,
              },
            } as ICreateReferenceFieldDTO
          }
          return field as ICreateFieldDTO
        })
        .filter((v) => !!v) as ICreateSchemaDTO

      const id = ids.mustGet(baseName, dto.name)
      const table = this.create({ ...dto, id, schema })
      return { table, dto: { ...dto, id: table.id.value } }
    })

    for (const { table } of tables) {
      const referenceFields = table.schema.getReferenceFields().filter((f) => referenceIds.has(f.id.value))

      for (const referenceField of referenceFields) {
        const foreignTable = tables.find(({ table }) => table.id.value === referenceField.foreignTableId)?.table
        if (!foreignTable) {
          throw new Error("Foreign table not found")
        }
        const dto = symmetricFields.find((f) => f.option.symmetricFieldId === referenceField.id.value)
        const symmetricField = ReferenceField.createSymmetricField(table, foreignTable, referenceField, dto)
        foreignTable.$createFieldSpec(symmetricField)
      }
    }

    for (const { table, dto } of tables) {
      const rollupFieldDTOs = dto.schema.filter((field) => field.type === "rollup")
      for (const dto of rollupFieldDTOs) {
        let referenceFieldId: string | undefined
        if (dto.option.referenceFieldId) {
          referenceFieldId = dto.option.referenceFieldId
        } else if (dto.option.foreignReferenceField) {
          const table = tables.find(({ table }) => table.name.value === dto.option.foreignReferenceField?.tableName)
          const field = table?.table.schema.fields.find((f) => f.id.value === dto.option.foreignReferenceField?.fieldId)
          if (field?.type === "reference") {
            referenceFieldId = field.symmetricFieldId
          }
        }

        if (referenceFieldId) {
          table.$createField({
            ...dto,
            option: {
              ...dto.option,
              referenceFieldId,
            },
          })
        }
      }
    }

    for (const { table, dto } of tables) {
      if (Array.isArray(dto.fieldsOrder)) {
        table.reorderFields(dto.fieldsOrder)
      }
    }

    return tables.map(({ table, dto }) => {
      const records = dto.records?.map((record) => RecordDO.create(table, record)) ?? []
      return { table, records }
    })
  }

  fromJSON(dto: ITableDTO): TableDo {
    return this.builder
      .setId(dto.id)
      .setBaseId(dto.baseId)
      .setName(dto.name)
      .setSchema(dto.schema)
      .setSpaceId(dto.spaceId)
      .setViews(dto.views)
      .setForms(dto.forms)
      .setRLS(dto.rls)
      .build()
  }
}

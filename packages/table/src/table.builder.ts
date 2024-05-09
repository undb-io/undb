import { inject, injectable, singleton } from '@undb/di'
import { createTableDTO, type ICreateTableDTO } from './dto'
import type { ICreateSchemaDTO } from './modules/schema/dto/create-schema.dto'
import type { ISchemaDTO } from './modules/schema/dto/schema.dto'
import { Schema } from './modules/schema/schema.vo'
import { TableIdSpecification } from './specifications/table-id.specification'
import { TableNameSpecification } from './specifications/table-name.specification'
import { TableSchemaSpecification } from './specifications/table-schema.specification'
import { TableIdVo } from './table-id.vo'
import { TableNameVo } from './table-name.vo'
import { TableDo } from './table.do'

export interface ITableBuilder {
  reset(): void
  setId(id?: string): ITableBuilder
  setName(name: string): ITableBuilder
  createSchema(dto: ICreateSchemaDTO): ITableBuilder
  setSchema(dto: ISchemaDTO): ITableBuilder
  build(): TableDo
}

@injectable()
export class TableBuilder implements ITableBuilder {
  private table!: TableDo

  constructor() {
    this.reset()
  }

  reset(): void {
    this.table = new TableDo()
  }

  setId(id?: string): ITableBuilder {
    new TableIdSpecification(TableIdVo.fromStringOrCreate(id)).mutate(this.table)
    return this
  }

  setName(name: string): ITableBuilder {
    new TableNameSpecification(new TableNameVo(name)).mutate(this.table)
    return this
  }

  createSchema(dto: ICreateSchemaDTO): ITableBuilder {
    new TableSchemaSpecification(Schema.create(dto)).mutate(this.table)
    return this
  }

  setSchema(dto: ISchemaDTO): ITableBuilder {
    new TableSchemaSpecification(Schema.fromJSON(dto)).mutate(this.table)
    return this
  }

  build() {
    return this.table
  }
}

export interface ITableCreator {
  create(dto: ICreateTableDTO): TableDo
}

@singleton()
export class TableCreator {
  constructor(
    @inject(TableBuilder)
    private readonly builder: ITableBuilder
  ) {}

  create(dto: ICreateTableDTO): TableDo {
    dto = createTableDTO.parse(dto)
    return this.builder.setId(dto.id).setName(dto.name).createSchema(dto.schema).build()
  }
}

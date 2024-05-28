import { container, inject, injectable, singleton } from "@undb/di"
import { createTableDTO, type ICreateTableDTO, type ITableDTO } from "./dto"
import { TableCreatedEvent } from "./events"
import type { ICreateFormDTO, IFormsDTO } from "./modules"
import type { ICreateSchemaDTO } from "./modules/schema/dto/create-schema.dto"
import type { ISchemaDTO } from "./modules/schema/dto/schema.dto"
import { Schema } from "./modules/schema/schema.vo"
import type { IViewsDTO } from "./modules/views/dto"
import { Views } from "./modules/views/views.vo"
import { FormsVO } from "./modules/forms/forms.vo"
import { TableViewsSpecification } from "./specifications"
import { TableFormsSpecification } from "./specifications/table-forms.specification"
import { TableIdSpecification } from "./specifications/table-id.specification"
import { TableNameSpecification } from "./specifications/table-name.specification"
import { TableSchemaSpecification } from "./specifications/table-schema.specification"
import { TableIdVo } from "./table-id.vo"
import { TableNameVo } from "./table-name.vo"
import { TableDo } from "./table.do"
import { applyRules } from "@undb/domain"
import { FieldNameShouldBeUnique } from "./modules/schema/rules"

export interface ITableBuilder {
  reset(): void
  setId(id?: string): ITableBuilder
  setName(name: string): ITableBuilder
  createSchema(dto: ICreateSchemaDTO): ITableBuilder
  setSchema(dto: ISchemaDTO): ITableBuilder
  createViews(): ITableBuilder
  createForms(dto: ICreateFormDTO[]): ITableBuilder
  setViews(dto: IViewsDTO): ITableBuilder
  setForms(dto?: IFormsDTO): ITableBuilder
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

  createViews(): ITableBuilder {
    new TableViewsSpecification(Views.create()).mutate(this.table)
    return this
  }

  setViews(dto: IViewsDTO): ITableBuilder {
    new TableViewsSpecification(Views.fromJSON(dto)).mutate(this.table)
    return this
  }

  createForms(dto: ICreateFormDTO[]): ITableBuilder {
    throw new Error("Method not implemented.")
  }

  setForms(dto: IFormsDTO = []): ITableBuilder {
    new TableFormsSpecification(FormsVO.fromJSON(dto)).mutate(this.table)
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
    private readonly builder: ITableBuilder,
  ) {}

  create(dto: ICreateTableDTO): TableDo {
    dto = createTableDTO.parse(dto)
    const table = this.builder.setId(dto.id).setName(dto.name).createSchema(dto.schema).createViews().build()

    applyRules(new FieldNameShouldBeUnique(table.schema))

    // @ts-ignore - TODO: fix this
    table.addDomainEvent(new TableCreatedEvent({ table: table.toJSON() }))
    return table
  }

  fromJSON(dto: ITableDTO): TableDo {
    return this.builder
      .setId(dto.id)
      .setName(dto.name)
      .setSchema(dto.schema)
      .setViews(dto.views)
      .setForms(dto.forms)
      .build()
  }
}

export const tableCreator = container.resolve(TableCreator)

import { None, Some } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import { TableRLSGroup, type ICreateFormDTO, type IFormsDTO, type IRLSGroupDTO } from "./modules"
import { FormsVO } from "./modules/forms/forms.vo"
import type { ICreateSchemaDTO } from "./modules/schema/dto/create-schema.dto"
import type { ISchemaDTO } from "./modules/schema/dto/schema.dto"
import { Schema } from "./modules/schema/schema.vo"
import type { ICreateViewDTO, IViewsDTO } from "./modules/views/dto"
import { Views } from "./modules/views/views.vo"
import { TableBaseIdSpecification, TableViewsSpecification } from "./specifications"
import { TableFormsSpecification } from "./specifications/table-forms.specification"
import { TableIdSpecification } from "./specifications/table-id.specification"
import { TableNameSpecification } from "./specifications/table-name.specification"
import { WithTableRLS } from "./specifications/table-rls.specification"
import { TableSchemaSpecification } from "./specifications/table-schema.specification"
import { TableSpaceIdSpecification } from "./specifications/table-space-id.specification"
import { TableIdVo } from "./table-id.vo"
import { TableNameVo } from "./table-name.vo"
import { TableDo } from "./table.do"

export interface ITableBuilder {
  reset(): void
  setId(id?: string): ITableBuilder
  setBaseId(id: string): ITableBuilder
  setSpaceId(spaceId: ISpaceId): ITableBuilder
  setName(name: string): ITableBuilder
  createSchema(dto: ICreateSchemaDTO): ITableBuilder
  setSchema(dto: ISchemaDTO): ITableBuilder
  createViews(dto?: ICreateViewDTO[]): ITableBuilder
  createForms(dto?: ICreateFormDTO[]): ITableBuilder
  setViews(dto: IViewsDTO): ITableBuilder
  setForms(dto?: IFormsDTO): ITableBuilder
  setRLS(dto?: IRLSGroupDTO): ITableBuilder
  build(): TableDo
}

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

  setBaseId(id: string): ITableBuilder {
    new TableBaseIdSpecification(id).mutate(this.table)
    return this
  }

  setSpaceId(spaceId: ISpaceId): ITableBuilder {
    new TableSpaceIdSpecification(spaceId).mutate(this.table)
    return this
  }

  setName(name: string): ITableBuilder {
    new TableNameSpecification(new TableNameVo(name)).mutate(this.table)
    return this
  }

  createSchema(dto: ICreateSchemaDTO): ITableBuilder {
    new TableSchemaSpecification(Schema.create(this.table, dto)).mutate(this.table)
    return this
  }

  setSchema(dto: ISchemaDTO): ITableBuilder {
    new TableSchemaSpecification(Schema.fromJSON(dto)).mutate(this.table)
    return this
  }

  createViews(dto?: ICreateViewDTO[]): ITableBuilder {
    new TableViewsSpecification(Views.create(this.table, dto)).mutate(this.table)
    return this
  }

  setViews(dto: IViewsDTO): ITableBuilder {
    new TableViewsSpecification(Views.fromJSON(this.table, dto)).mutate(this.table)
    return this
  }

  createForms(dto: ICreateFormDTO[]): ITableBuilder {
    new TableFormsSpecification(FormsVO.create(this.table, dto)).mutate(this.table)
    return this
  }

  setForms(dto: IFormsDTO = []): ITableBuilder {
    new TableFormsSpecification(FormsVO.fromJSON(dto)).mutate(this.table)
    return this
  }

  setRLS(dto?: IRLSGroupDTO): ITableBuilder {
    new WithTableRLS(None, dto ? Some(TableRLSGroup.fromJSON(dto)) : None).mutate(this.table)
    return this
  }

  build() {
    return this.table
  }
}

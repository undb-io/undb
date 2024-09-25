import { inject } from "@undb/di"
import type { Option } from "@undb/domain"
import type { ITemplateDTO } from "../dto/template.dto"
import type { ITemplateSpecification } from "./interface"
import type { TemplateDO } from "./template.do"

export interface ITemplateRepository {
  find(): Promise<TemplateDO[]>
}

export interface ITemplateQueryRepository {
  findOneById(id: string): Promise<Option<ITemplateDTO>>
  find(spec: Option<ITemplateSpecification>): Promise<ITemplateDTO[]>
}

export const TEMPLATE_REPOSITORY = Symbol.for("ITemplateRepository")
export const injectTemplateRepository = () => inject(TEMPLATE_REPOSITORY)

export const TEMPLATE_QUERY_REPOSITORY = Symbol.for("IBaseShareQueryRepository")
export const injectTemplateQueryRepository = () => inject(TEMPLATE_QUERY_REPOSITORY)

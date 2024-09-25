import { singleton } from "@undb/di"
import { Option } from "@undb/domain"
import type { ITemplateDTO, ITemplateQueryRepository, ITemplateSpecification } from "@undb/template"
import { templateData } from "./template-data"

@singleton()
export class TemplateQueryRepository implements ITemplateQueryRepository {
  async find(spec: Option<ITemplateSpecification>): Promise<ITemplateDTO[]> {
    return templateData
  }

  async findOneById(id: string): Promise<Option<ITemplateDTO>> {
    const template = templateData.find((t) => t.id === id)
    return Option(template)
  }
}

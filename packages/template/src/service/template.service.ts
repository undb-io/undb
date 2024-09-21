import { singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import type { IBaseTemplateDTO } from "../dto"

export interface ITemplateService {
  create(dto: IBaseTemplateDTO): Promise<void>
}

@singleton()
export class TemplateService implements ITemplateService {
  private readonly logger = createLogger(TemplateService.name)
  async create(dto: IBaseTemplateDTO): Promise<void> {
    this.logger.info(dto)
  }
}

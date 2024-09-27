import { singleton } from "@undb/di"
import { None } from "@undb/domain"
import { baseTemplateSchema, injectTemplateQueryRepository, type ITemplateQueryRepository } from "@undb/template"
import Elysia from "elysia"

@singleton()
export class TemplateModule {
  constructor(
    @injectTemplateQueryRepository()
    private readonly templateRepo: ITemplateQueryRepository,
  ) {}
  route() {
    return new Elysia()
      .get("/api/template/base/schema.json", () => {
        return baseTemplateSchema
      })
      .get("/api/templates", async () => {
        const templates = await this.templateRepo.find(None)

        return {
          templates,
        }
      })
  }
}

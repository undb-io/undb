import { singleton } from "@undb/di"
import { baseTemplateSchema } from "@undb/template"
import Elysia from "elysia"

@singleton()
export class TemplateModule {
  route() {
    return new Elysia().get("/api/template/base/schema.json", () => {
      return baseTemplateSchema
    })
  }
}

import { singleton } from "@undb/di"
import { templateSchema } from "@undb/template"
import Elysia from "elysia"

@singleton()
export class TemplateModule {
  route() {
    return new Elysia().get("/api/template/schema.json", () => {
      return templateSchema
    })
  }
}

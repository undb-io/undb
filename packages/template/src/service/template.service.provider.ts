import { container, inject } from "@undb/di"
import { TemplateService } from "./template.service"

export const TEMPLATE_SERVICE = Symbol.for("TemplateService")
export const injectTemplateService = () => inject(TEMPLATE_SERVICE)
container.register(TEMPLATE_SERVICE, { useClass: TemplateService })

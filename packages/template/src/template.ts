import type { TemplateExport, TemplateID, TemplateName } from './value-objects/index.js'

export class Template {
  id!: TemplateID
  name!: TemplateName
  exports!: TemplateExport[]

  static empty() {
    return new this()
  }
}

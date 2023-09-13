import type { TemplateExport, TemplateID, TemplateName } from './value-objects/index.js'

export class Template {
  id!: TemplateID
  name!: TemplateName
  enabled!: boolean
  export!: TemplateExport

  static empty() {
    return new this()
  }
}

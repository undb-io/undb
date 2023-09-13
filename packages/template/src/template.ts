import type { TemplateExport, TemplateID, TemplateName } from './value-objects/index.js'

export class Template {
  id!: TemplateID
  name!: TemplateName
  enabled!: boolean
  export!: TemplateExport

  toJSON() {
    return {
      id: this.id.value,
      name: this.name.unpack(),
      export: this.export.unpack(),
    }
  }

  static empty() {
    return new this()
  }
}

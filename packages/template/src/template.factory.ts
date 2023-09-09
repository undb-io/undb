import { and } from '@undb/domain'
import type { TemplateSpecification } from './interface.js'
import { Template } from './template.js'

export class TemplateFactory {
  static create(...specs: TemplateSpecification[]) {
    return and(...specs)
      .unwrap()
      .mutate(Template.empty())
      .unwrap()
  }
}

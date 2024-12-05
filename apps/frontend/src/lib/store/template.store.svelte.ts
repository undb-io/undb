import { DEFAULT_TEMP_SPACE_ID } from "@undb/space"
import { TemplateFactory, type ITemplateDTO, type TemplateDTO } from "@undb/template"
import { getContext, setContext } from "svelte"
import { derived, type Writable } from "svelte/store"

export function setTemplate(template: Writable<ITemplateDTO>) {
  setContext("template", template)
}

export function getTemplate() {
  return getContext<Writable<ITemplateDTO | undefined>>("template")
}

export function getIsTemplate() {
  return derived([getTemplate()], ([$template]) => !!$template)
}

export class TemplateStore {
  templates = $state<Record<string, TemplateDTO>>({})
  savedTemplateIds = $state<string[]>([])

  isTemplateSaved = (id: string) => {
    return this.savedTemplateIds.includes(id)
  }

  mustGetTemplate = (template: ITemplateDTO): TemplateDTO => {
    const id = template.id
    const t = this.templates[id] ?? TemplateFactory.create(template.template.template, [], DEFAULT_TEMP_SPACE_ID)
    this.templates[id] = t
    return t
  }

  saveTemplate = (id: string, template: TemplateDTO) => {
    this.savedTemplateIds.push(id)
  }
}

export const templateStore = new TemplateStore()

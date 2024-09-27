import type { ITemplateDTO } from "@undb/template"
import { getContext, setContext } from "svelte"
import { type Writable, derived } from "svelte/store"

export function setTemplate(template: Writable<ITemplateDTO>) {
  setContext("template", template)
}

export function getTemplate() {
  return getContext<Writable<ITemplateDTO | undefined>>("template")
}

export function getIsTemplate() {
  return derived([getTemplate()], ([$template]) => !!$template)
}

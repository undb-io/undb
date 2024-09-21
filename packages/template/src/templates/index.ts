import type { IBaseTemplateDTO } from "../dto"
import { default as test } from "./test.base.json"

const templates: Record<string, IBaseTemplateDTO> = { test } as const

export { templates }

import type { IBaseTemplateDTO } from "../dto"
import { default as todoList } from "./todoList.base.json"

const templates = { todoList } as Record<string, IBaseTemplateDTO>

export { templates }

import type { IBaseTemplateDTO } from "../dto"
import { default as projectManagement } from "./projectManagement.base.json"
import { default as todoList } from "./todoList.base.json"

const templates = { todoList, projectManagement } as Record<string, IBaseTemplateDTO>

export { templates }

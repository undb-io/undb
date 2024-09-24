import type { IBaseTemplateDTO } from "../dto"
import { default as projectManagement } from "./projectManagement.base.json"
import { default as todoList } from "./todoList.base.json"
import { default as officeInventoryManagement } from "./officeInventoryManagement.base.json"
import { default as eventPlaningList } from "./eventPlaning.base.json"

const templates = { todoList, projectManagement, officeInventoryManagement, eventPlaningList } as Record<string, IBaseTemplateDTO>

export { templates }

import { default as eventPlaningList } from "./eventPlaning.base.json"
import { default as officeInventoryManagement } from "./officeInventoryManagement.base.json"
import { default as projectManagement } from "./projectManagement.base.json"
import { default as todoList } from "./todoList.base.json"

const templates = { todoList, projectManagement, officeInventoryManagement, eventPlaningList } as const

export { templates }

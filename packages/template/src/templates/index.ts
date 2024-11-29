import { default as agileDevelopment } from "./agileDevelopment.base.json"
import { default as crm } from "./crm.base.json"
import { default as eventPlaningList } from "./eventPlaning.base.json"
import { default as everything } from "./everything.base.json"
import { default as hr } from "./hr.base.json"
import { default as officeInventoryManagement } from "./officeInventoryManagement.base.json"
import { default as projectManagement } from "./projectManagement.base.json"
import { default as remoteWorkManagement } from "./remoteWorkManagement.base.json"
import { default as salesCrm } from "./salesCrm.base.json"
import { default as socialMediaContent } from "./socialMediaContent.base.json"
import { default as test } from "./test.base.json"
import { default as todoList } from "./todoList.base.json"

const templates = {
  test,
  todoList,
  projectManagement,
  officeInventoryManagement,
  eventPlaningList,
  crm,
  salesCrm,
  socialMediaContent,
  hr,
  agileDevelopment,
  remoteWorkManagement,
  everything,
} as const

export { templates }

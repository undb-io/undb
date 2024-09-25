import { templates, type IBaseTemplateDTO, type ITemplateDTO } from "@undb/template"

export const templateData: ITemplateDTO[] = [
  {
    id: "1",
    name: "Project Management",
    template: {
      type: "base",
      template: templates.projectManagement as IBaseTemplateDTO,
    },
  },
  {
    id: "2",
    name: "Event Planning List",
    template: {
      type: "base",
      template: templates.eventPlaningList as IBaseTemplateDTO,
    },
  },
  {
    id: "3",
    name: "To-Do List",
    template: {
      type: "base",
      template: templates.todoList as IBaseTemplateDTO,
    },
  },
  {
    id: "4",
    name: "Office Inventory Management",
    template: {
      type: "base",
      template: templates.officeInventoryManagement as IBaseTemplateDTO,
    },
  },
]

import { templates, type IBaseTemplateDTO, type ITemplateDTO } from "@undb/template"

export const templateData: ITemplateDTO[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Project Management",
    category: "it",
    description: "A comprehensive template for managing projects, tasks, and team collaboration.",
    template: {
      type: "base",
      template: templates.projectManagement as IBaseTemplateDTO,
    },
  },
  {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    name: "Event Planning List",
    description: "A template for planning events, including tasks, deadlines, and resources.",
    category: "sales",
    template: {
      type: "base",
      template: templates.eventPlaningList as IBaseTemplateDTO,
    },
  },
  {
    id: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    name: "To-Do List",
    category: "other",
    description: "A simple template for managing daily tasks and reminders.",
    template: {
      type: "base",
      template: templates.todoList as IBaseTemplateDTO,
    },
  },
  {
    id: "6ba7b813-9dad-11d1-80b4-00c04fd430c8",
    name: "Office Inventory Management",
    category: "finance",
    description: "A template for managing office supplies, equipment, and inventory.",
    template: {
      type: "base",
      template: templates.officeInventoryManagement as IBaseTemplateDTO,
    },
  },
]

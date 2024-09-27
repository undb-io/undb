import { env } from "@undb/env"
import { templates, type IBaseTemplateDTO, type ITemplateDTO } from "@undb/template"

export const templateData: ITemplateDTO[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    icon: "🚀",
    name: "Project Management",
    category: "it",
    description:
      "A comprehensive template for managing projects, tasks, and team collaboration. It includes features for tracking project progress, assigning tasks, managing resources, and facilitating team communication, helping you achieve project goals more efficiently.",
    template: {
      type: "base",
      template: templates.projectManagement as IBaseTemplateDTO,
    },
  },
  {
    id: "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
    icon: "💼",
    name: "CRM",
    category: "sales",
    description: "A template for managing customer relationships, deals, and activities.",
    template: {
      type: "base",
      template: templates.crm as IBaseTemplateDTO,
    },
  },
  {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    icon: "🎉",
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
    icon: "📝",
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
    icon: "📦",
    name: "Office Inventory Management",
    category: "finance",
    description: "A template for managing office supplies, equipment, and inventory.",
    template: {
      type: "base",
      template: templates.officeInventoryManagement as IBaseTemplateDTO,
    },
  },
]

if (env.NODE_ENV === "development") {
  templateData.unshift({
    id: "test",
    icon: "💼",
    name: "Test",
    category: "sales",
    description: "A template for testing",
    template: {
      type: "base",
      template: templates.test as IBaseTemplateDTO,
    },
  })
}

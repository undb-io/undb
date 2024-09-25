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
]

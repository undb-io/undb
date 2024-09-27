import type { ITemplateDTO } from "@undb/template"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch("http://localhost:3721/api/templates")
  const { templates } = (await res.json()) as { templates: ITemplateDTO[] }

  return {
    templates,
  }
}

import { trpc } from "$lib/trpc/client"
import type { LayoutLoad } from "./$types"

export const prerender = "auto"

export const load: LayoutLoad = async ({ params }: { params: { templateId: string } }) => {
  const template = await trpc.template.get.query({ id: params.templateId })

  return {
    template,
  }
}

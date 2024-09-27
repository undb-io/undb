import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params, fetch }) => {
  return { template: undefined }
}

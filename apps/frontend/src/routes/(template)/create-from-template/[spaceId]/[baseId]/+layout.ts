import { GetCreateFromTemplateDataStore } from "$houdini"
import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async (event) => {
  const { spaceId, baseId } = event.params

  const store = new GetCreateFromTemplateDataStore()

  await store.fetch({
    event,
    variables: { spaceId, baseId },
  })

  return {
    store,
  }
}

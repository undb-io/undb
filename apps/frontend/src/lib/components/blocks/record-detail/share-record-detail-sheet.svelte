<script lang="ts">
  import { queryParam, ssp } from "sveltekit-search-params"
  import { getTable, viewId } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createQuery } from "@tanstack/svelte-query"
  import { RecordDO } from "@undb/table"
  import { derived } from "svelte/store"
  import { preferences } from "$lib/store/persisted.store"
  import RecordDetailSheet from "./record-detail-sheet.svelte"
  import { page } from "$app/stores"

  export let readonly = false

  const r = queryParam("r", ssp.string(), { pushHistory: false })

  const table = getTable()

  const record = createQuery(
    derived([table, r, page], ([$table, $recordId, $page]) => ({
      queryKey: [$recordId, "get", $preferences.showHiddenFields],
      queryFn: () => {
        return trpc.shareData.record.query({
          shareId: $page.params.shareId,
          recordId: $recordId!,
        })
      },
      enabled: !!$recordId,
    })),
  )

  $: recordDo = $record.data?.record ? RecordDO.fromJSON($table, $record.data?.record) : undefined
</script>

<RecordDetailSheet {readonly} {recordDo} isLoading={$record.isLoading} />

<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createQuery } from "@tanstack/svelte-query"
  import { RecordDO } from "@undb/table"
  import { derived, type Readable } from "svelte/store"
  import { preferences } from "$lib/store/persisted.store"
  import RecordDetailSheet from "./record-detail-sheet.svelte"
  import { page } from "$app/stores"
  import { r } from "$lib/store/records.store"

  export let readonly = false
  export let viewId: Readable<string | undefined>

  const table = getTable()

  const record = createQuery(
    derived([table, r, page], ([$table, $recordId, $page]) => ({
      queryKey: [$recordId, "get", $preferences.showHiddenFields],
      queryFn: () => {
        return trpc.shareData.record.query({
          shareId: $page.params.shareId,
          tableId: $table.id.value,
          recordId: $recordId!,
        })
      },
      enabled: !!$recordId,
    })),
  )

  $: recordDo = $record.data?.record ? RecordDO.fromJSON($table, $record.data?.record) : undefined
</script>

<RecordDetailSheet {readonly} {viewId} {recordDo} isLoading={$record.isLoading} {r} />

<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { createQuery } from "@tanstack/svelte-query"
  import { RecordDO } from "@undb/table"
  import { derived } from "svelte/store"
  import { preferences } from "$lib/store/persisted.store"
  import RecordDetailSheet from "./record-detail-sheet.svelte"
  import { r } from "$lib/store/records.store"
  import type { Readable } from "svelte/store"
  import { getDataService } from "$lib/store/data-service.store"

  export let readonly = false
  export let viewId: Readable<string | undefined>

  const dataService = getDataService()

  const table = getTable()

  const record = createQuery(
    derived([table, r, preferences], ([$table, $recordId, $preferences]) => ({
      queryKey: [$recordId, "get", $preferences.showHiddenFields],
      queryFn: () =>
        dataService.records.getRecordById({
          tableId: $table?.id.value,
          id: $recordId!,
          ignoreView: $preferences.showHiddenFields,
        }),
      enabled: !!$recordId,
    })),
  )

  $: recordDo = $record.data?.record ? RecordDO.fromJSON($table, $record.data?.record) : undefined
</script>

<RecordDetailSheet {viewId} {readonly} {recordDo} isLoading={$record.isLoading} {r} />

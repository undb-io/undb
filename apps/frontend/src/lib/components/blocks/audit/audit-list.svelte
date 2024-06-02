<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createQuery } from "@tanstack/svelte-query"

  const table = getTable()

  export let recordId: string

  const getAudits = createQuery({
    queryKey: ["table", $table.id.value, "record", recordId, "audits"],
    queryFn: () => trpc.record.audits.list.query({ recordId }),
  })
</script>

audits

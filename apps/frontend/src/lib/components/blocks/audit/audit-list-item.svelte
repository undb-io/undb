<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import type { IAuditDTO, IRecordUpdatedAudit } from "@undb/audit"
  import AuditListItemField from "./audit-list-item-field.svelte"

  export let audit: IRecordUpdatedAudit

  $: previous = audit.detail.previous
  $: record = audit.detail.record ?? {}
  $: values = Object.entries(record.values ?? {})
  $: meta = audit.meta
</script>

<div class="bg-muted space-y-1 rounded-sm p-2 text-sm shadow-inner">
  {#each values as [fieldName]}
    <AuditListItemField {meta} {record} {previous} {fieldName} />
  {/each}
</div>

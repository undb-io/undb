<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import type { IAuditDTO, IRecordUpdatedAudit } from "@undb/audit"
  import AuditListItemField from "./audit-list-item-field.svelte"

  export let audit: IRecordUpdatedAudit
  const table = getTable()

  $: previous = audit.detail.previous
  $: record = audit.detail.record ?? {}
  $: values = Object.entries(record.values ?? {})
</script>

<div class="bg-muted space-y-1 rounded-sm p-2 text-sm shadow-inner">
  {#each values as [fieldName]}
    {@const field = $table.schema.getFieldByName(fieldName).into(undefined)}
    {#if field}
      <AuditListItemField {field} {record} {previous} {fieldName} />
    {/if}
  {/each}
</div>

<script lang="ts">
  import { getIsFieldHasDisplayValue, type Field, type FieldType, type IReadableRecordDTO } from "@undb/table"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import type { IRecordTableMeta } from "@undb/table/src/modules/records/events/record-events-meta"

  export let fieldName: string
  export let record: IReadableRecordDTO
  export let previous: IReadableRecordDTO
  export let meta: { table: IRecordTableMeta }

  $: type = meta.table.fields[fieldName]?.type as FieldType

  $: previousValue = previous.values[fieldName]
  $: value = record.values[fieldName]
</script>

<div class="text-muted-foreground flex items-center gap-2">
  <FieldIcon {type} class="h-3 w-3" />
  {fieldName}
</div>
{#if !getIsFieldHasDisplayValue(type)}
  {#if previousValue}
    <div>
      <span class="text-muted-foreground rounded-sm border border-red-400 bg-red-100 px-1.5">
        {previousValue}
      </span>
    </div>
  {/if}
  <div>
    <span class="rounded-sm border border-green-400 bg-green-100 px-1.5">
      {value}
    </span>
  </div>
{/if}

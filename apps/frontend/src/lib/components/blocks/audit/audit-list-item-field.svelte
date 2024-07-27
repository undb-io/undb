<script lang="ts">
  import { getIsFieldHasDisplayValue, type Field, type IReadableRecordDTO } from "@undb/table"
  import FieldIcon from "../field-icon/field-icon.svelte"

  export let field: Field
  export let fieldName: string
  export let record: IReadableRecordDTO
  export let previous: IReadableRecordDTO

  $: previousValue = previous.values[fieldName]
  $: value = record.values[fieldName]
</script>

<div class="text-muted-foreground flex items-center gap-2">
  <FieldIcon {field} type={field.type} class="h-3 w-3" />
  {field.name.value}
</div>
{#if !getIsFieldHasDisplayValue(field.type)}
  {#if previousValue}
    <div>
      <span class="border border-red-200 bg-red-100 px-1">
        {previousValue}
      </span>
    </div>
  {/if}
  <div>
    <span class="border border-green-200 bg-green-100 px-1">
      {value}
    </span>
  </div>
{/if}

<script lang="ts">
  import { type Field, type RecordDO } from "@undb/table"
  import FieldValue from "../field-value/field-value.svelte"
  import { getTable } from "$lib/store/table.store"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { queryParam } from "sveltekit-search-params"

  const table = getTable()
  export let fields: Field[]
  export let record: RecordDO
  export let readonly = false

  const r = queryParam("r")

  let values = record.flatten()
  let displayValues = record.displayValues?.toJSON() ?? {}
</script>

<button
  on:click={() => ($r = record.id.value)}
  disabled={readonly}
  data-record-id={record.id.value}
  class="mb-2 flex w-full flex-col space-y-2 rounded bg-white p-2 shadow"
>
  {#each fields as field}
    <div class="flex items-center gap-2">
      <Tooltip.Root>
        <Tooltip.Trigger>
          <FieldValue
            {field}
            tableId={$table.id.value}
            recordId={record.id.value}
            value={values[field.id.value]}
            type={field.type}
            displayValue={displayValues[field.id.value]}
          />
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>{field.name.value}</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  {/each}
</button>

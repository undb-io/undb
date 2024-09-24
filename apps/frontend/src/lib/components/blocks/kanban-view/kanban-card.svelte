<script lang="ts">
  import { ViewColor, type Field, type RecordDO } from "@undb/table"
  import FieldValue from "../field-value/field-value.svelte"
  import { getTable } from "$lib/store/table.store"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { queryParam } from "sveltekit-search-params"
  import { cn } from "$lib/utils"
  import { getBgColor } from "../grid-view/grid-view.util"

  const table = getTable()
  export let color: ViewColor | undefined

  export let fields: Field[]
  export let record: RecordDO
  export let readonly = false

  const r = queryParam("r")

  $: values = record.flatten()
  $: displayValues = record.displayValues?.toJSON() ?? {}

  $: colorSpec = color?.getSpec($table.schema).into(undefined)
  $: isMatch = colorSpec ? record.match(colorSpec) : false
  $: condition = isMatch ? color?.getMatchedFieldConditions($table, record)[0] : undefined
</script>

<button
  on:click={() => ($r = record.id.value)}
  disabled={readonly}
  data-record-id={record.id.value}
  class={cn("relative mb-2 flex w-full flex-col overflow-hidden rounded bg-white p-2 shadow", isMatch && "pl-3")}
>
  <div class="flex w-full flex-col space-y-2 overflow-hidden">
    {#each fields as field, idx (field.id.value)}
      <div class="flex w-full items-center gap-2 overflow-hidden">
        <Tooltip.Root>
          <Tooltip.Trigger class="w-full text-left">
            <FieldValue
              {field}
              tableId={$table.id.value}
              recordId={record.id.value}
              value={values[field.id.value]}
              type={field.type}
              displayValue={displayValues[field.id.value]}
              class={cn("w-full truncate text-left", idx === 0 ? "text-md font-medium" : "")}
            />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>{field.name.value}</p>
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
    {/each}
  </div>
  {#if isMatch}
    <div class={cn("absolute left-0 top-0 h-full w-1", condition && getBgColor(condition.option.color))}></div>
  {/if}
</button>

<script lang="ts">
  import { derived, type Readable, type Writable } from "svelte/store"
  import * as Table from "$lib/components/ui/table"
  import { getTable } from "$lib/store/table.store"
  import { getRecordsStore } from "$lib/store/records.store"
  import FieldValue from "../field-value/field-value.svelte"
  import { Maximize2Icon } from "lucide-svelte"
  import { cn } from "$lib/utils"

  const table = getTable()
  export let viewId: Readable<string | undefined>
  export let r: Writable<string | null>
  export let readonly: boolean = false

  const recordsStore = getRecordsStore()

  let fields = derived([table, viewId], ([$table, $viewId]) => $table?.getOrderedVisibleFields($viewId) ?? [])

  $: view = $table.views.getViewById($viewId)
  $: color = view.color.into(undefined)

  let records = recordsStore.records
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-10"></Table.Head>
      {#each $fields as field}
        <Table.Head>{field.name.value}</Table.Head>
      {/each}
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each $records as record (record.id.value)}
      {@const values = record.flatten()}
      {@const displayValues = record.displayValues?.toJSON() ?? {}}
      <Table.Row class="group">
        <Table.Cell>
          <button
            on:click={() => r.set(record.id.value)}
            class="opacity-0 transition-opacity duration-100 group-hover:opacity-100"
          >
            <Maximize2Icon class="text-muted-foreground size-3" />
          </button>
        </Table.Cell>
        {#each $fields as field, i}
          <Table.Cell>
            <FieldValue
              {r}
              {field}
              tableId={$table.id.value}
              recordId={record.id.value}
              value={values[field.id.value]}
              type={field.type}
              displayValue={displayValues[field.id.value]}
              class={cn("text-xs", i === 0 && "font-semibold")}
              {readonly}
            />
          </Table.Cell>
        {/each}
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>

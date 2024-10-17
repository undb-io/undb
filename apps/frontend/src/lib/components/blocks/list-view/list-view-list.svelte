<script lang="ts">
  import { derived, type Readable, type Writable } from "svelte/store"
  import * as Table from "$lib/components/ui/table"
  import { getTable } from "$lib/store/table.store"
  import { getRecordsStore } from "$lib/store/records.store"
  import FieldValue from "../field-value/field-value.svelte"

  const table = getTable()
  export let viewId: Readable<string | undefined>
  export let r: Writable<string | null>

  const recordsStore = getRecordsStore()

  let fields = derived([table, viewId], ([$table, $viewId]) => $table?.getOrderedVisibleFields($viewId) ?? [])

  $: view = $table.views.getViewById($viewId)
  $: color = view.color.into(undefined)

  let records = recordsStore.records
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      {#each $fields as field}
        <Table.Head>{field.name.value}</Table.Head>
      {/each}
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each $records as record (record.id.value)}
      {@const values = record.flatten()}
      {@const displayValues = record.displayValues?.toJSON() ?? {}}
      <Table.Row>
        {#each $fields as field}
          <Table.Cell>
            <FieldValue
              {r}
              {field}
              tableId={$table.id.value}
              recordId={record.id.value}
              value={values[field.id.value]}
              type={field.type}
              displayValue={displayValues[field.id.value]}
            />
          </Table.Cell>
        {/each}
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>

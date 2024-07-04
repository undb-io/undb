<script lang="ts">
  import { GetForeignTableStore } from "$houdini"
  import * as Popover from "$lib/components/ui/popover"
  import ForeignRecordsPicker from "./foreign-records-picker.svelte"
  import { readable, writable } from "svelte/store"
  import { ReferenceField, TableCreator } from "@undb/table"
  import Button from "$lib/components/ui/button/button.svelte"
  import { Skeleton } from "$lib/components/ui/skeleton"

  export let isSelected = false

  export let readonly = false
  export let tableId: string
  export let recordId: string | undefined
  export let field: ReferenceField
  $: foreignTableId = field.foreignTableId
  export let selected = writable<string[]>()

  export let onOpenChange: (open: boolean) => void = () => {}

  const foreignTableStore = new GetForeignTableStore()

  let open = false

  $: if (open) foreignTableStore.fetch({ variables: { tableId: foreignTableId } })

  $: table = $foreignTableStore.data?.table

  $: foreignTable = table ? readable(new TableCreator().fromJSON(table)) : null
</script>

<Popover.Root bind:open portal="body" {onOpenChange}>
  <Popover.Trigger>
    <slot>
      <Button size="xs" disabled={readonly} variant="link" type="button">+ Link Records</Button>
    </slot>
  </Popover.Trigger>
  <Popover.Content class="h-[400px] max-h-[700px] w-[500px] p-0 lg:max-w-4xl">
    {#if $foreignTableStore.fetching}
      <!-- content here -->
      <div class="space-y-2 p-4">
        <Skeleton class="h-[20px] w-full rounded-sm" />
        <Skeleton class="h-[20px] w-full rounded-sm" />
        <Skeleton class="h-[20px] w-full rounded-sm" />
      </div>
    {/if}
    {#if foreignTable}
      <ForeignRecordsPicker bind:isSelected {field} {tableId} {recordId} {foreignTable} bind:selected />
    {/if}
  </Popover.Content>
</Popover.Root>

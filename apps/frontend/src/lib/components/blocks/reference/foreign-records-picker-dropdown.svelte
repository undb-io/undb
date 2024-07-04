<script lang="ts">
  import { GetForeignTableStore } from "$houdini"
  import * as Popover from "$lib/components/ui/popover"
  import ForeignRecordsPicker from "./foreign-records-picker.svelte"
  import { readable } from "svelte/store"
  import { ReferenceField, TableCreator } from "@undb/table"
  import Button from "$lib/components/ui/button/button.svelte"
  import { PlusIcon } from "lucide-svelte"
  import { Skeleton } from "$lib/components/ui/skeleton"

  export let readonly = false
  export let tableId: string
  export let recordId: string | undefined
  export let field: ReferenceField
  $: foreignTableId = field.foreignTableId
  export let value: string[] = []

  const foreignTableStore = new GetForeignTableStore()

  let open = false

  $: if (open) foreignTableStore.fetch({ variables: { tableId: foreignTableId } })

  $: table = $foreignTableStore.data?.table

  $: foreignTable = table ? readable(new TableCreator().fromJSON(table)) : null
</script>

<Popover.Root bind:open portal="body">
  <Popover.Trigger>
    <slot>
      <Button size="sm" disabled={readonly} variant="link" type="button">
        <PlusIcon class="mr-2 h-4 w-4" />
        Link Records
      </Button>
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
      <ForeignRecordsPicker {field} {tableId} {recordId} {foreignTable} bind:selected={value} />
    {/if}
  </Popover.Content>
</Popover.Root>

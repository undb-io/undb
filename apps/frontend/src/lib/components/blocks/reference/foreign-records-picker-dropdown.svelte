<script lang="ts">
  import { GetForeignTableStore } from "$houdini"
  import * as Popover from "$lib/components/ui/popover"
  import ForeignRecordsPicker from "./foreign-records-picker.svelte"
  import { readable, writable } from "svelte/store"
  import { ReferenceField, TableFactory } from "@undb/table"
  import Button from "$lib/components/ui/button/button.svelte"
  import { LoaderCircleIcon } from "lucide-svelte"

  export let isSelected = false

  export let shouldUpdate = false
  export let readonly = false
  export let tableId: string
  export let recordId: string | undefined
  export let field: ReferenceField
  $: foreignTableId = field.foreignTableId
  export let selected = writable<string[]>()
  export let onValueChange = (value: string[]) => {}
  export let onOpenChange: (open: boolean) => void = () => {}

  const foreignTableStore = new GetForeignTableStore()

  let open = false

  $: if (open) foreignTableStore.fetch({ variables: { tableId: foreignTableId } })

  $: table = $foreignTableStore.data?.table

  $: foreignTable = table ? readable(TableFactory.fromJSON(table)) : null
</script>

<Popover.Root portal="body" bind:open {onOpenChange}>
  <Popover.Trigger>
    <slot>
      <Button size="xs" disabled={readonly} variant="link" type="button">+ Link Records</Button>
    </slot>
  </Popover.Trigger>
  <Popover.Content class="h-[400px] max-h-[700px] w-[500px] p-0 lg:max-w-4xl">
    {#if $foreignTableStore.fetching}
      <!-- content here -->
      <div class="flex h-full w-full items-center justify-center space-y-2 p-4">
        <LoaderCircleIcon class="mr-2 h-8 w-8 animate-spin" />
      </div>
    {/if}
    {#if foreignTable}
      <ForeignRecordsPicker
        {readonly}
        {shouldUpdate}
        bind:isSelected
        {field}
        {tableId}
        {recordId}
        {foreignTable}
        bind:selected
        {onValueChange}
      />
    {/if}
  </Popover.Content>
</Popover.Root>

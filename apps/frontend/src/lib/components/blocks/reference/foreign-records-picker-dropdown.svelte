<script lang="ts">
  import { GetForeignTableStore } from "$houdini"
  import * as Popover from "$lib/components/ui/popover"
  import ForeignRecordsPicker from "./foreign-records-picker.svelte"
  import { derived, readable, writable } from "svelte/store"
  import { ReferenceField, TableFactory } from "@undb/table"
  import Button from "$lib/components/ui/button/button.svelte"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { type Writable } from "svelte/store"

  export let isSelected = false

  export let shouldUpdate = false
  export let readonly = false
  export let tableId: string
  export let r: Writable<string | null>
  export let recordId: string | undefined
  export let field: ReferenceField
  $: foreignTableId = field.foreignTableId
  export let selected = writable<string[]>()
  export let onValueChange = (value: string[]) => {}
  export let onOpenChange: (open: boolean) => void = () => {}
  export let onSuccess: (id?: string) => void = () => {}

  const foreignTableStore = new GetForeignTableStore()

  let open = false

  $: if (open) foreignTableStore.fetch({ variables: { tableId: foreignTableId } })

  const foreignTable = derived(foreignTableStore, ($foreignTableStore) => {
    const table = $foreignTableStore.data?.table
    return table ? new TableFactory().fromJSON(table) : null
  })
</script>

<Popover.Root portal="body" bind:open {onOpenChange}>
  <Popover.Trigger asChild let:builder>
    <slot {builder}>
      <Button size="xs" disabled={readonly} variant="link" type="button" builders={[builder]}>+ Link Records</Button>
    </slot>
  </Popover.Trigger>
  <Popover.Content class="h-[400px] max-h-[700px] w-[500px] p-0 lg:max-w-4xl">
    {#if $foreignTableStore.fetching}
      <!-- content here -->
      <div class="flex h-full w-full items-center justify-center space-y-2 p-4">
        <LoaderCircleIcon class="mr-2 h-8 w-8 animate-spin" />
      </div>
    {/if}
    {#if $foreignTable}
      <ForeignRecordsPicker
        {readonly}
        {r}
        {shouldUpdate}
        bind:isSelected
        {field}
        {tableId}
        {recordId}
        {foreignTable}
        bind:selected
        {onValueChange}
        {onSuccess}
      />
    {/if}
  </Popover.Content>
</Popover.Root>

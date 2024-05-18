<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import * as Select from "$lib/components/ui/select"
  import Badge from "$lib/components/ui/badge/badge.svelte"
  import { ArrowDownAzIcon, ArrowUpDownIcon, ArrowUpZaIcon } from "lucide-svelte"
  import { cn } from "$lib/utils"

  import { getTable } from "$lib/store/table.store"
  import { type IViewSort } from "@undb/table"
  import FieldPicker from "../field-picker/field-picker.svelte"

  const table = getTable()
  $: view = $table.views.getViewById()
  $: sort = view.sort.into(undefined)
  $: fields = $table.getOrderedFields()

  $: count = sort?.count ?? 0

  let value: IViewSort = []

  let open = false

  function addSort() {
    value = [...value, { fieldId: fields[0].id.value, direction: "asc" }]
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      size="sm"
      class={cn(count && "text-background hover:text-background bg-rose-400/75 hover:bg-rose-400/90")}
    >
      <ArrowUpDownIcon class="mr-2 h-4 w-4" />
      Sorts
      {#if count}
        <Badge variant="secondary" class="ml-2 rounded-full">{count}</Badge>
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[330px] p-0 shadow-2xl" align="start">
    {#if value?.length}
      <div class="space-y-2 border-b px-4 pb-2 pt-0.5">
        <div class="text-muted-foreground px-4 py-3 pb-0 text-xs">Sorts</div>
        {#each value as item}
          <div class="flex w-full items-center">
            <FieldPicker bind:value={item.fieldId} class="flex-1 rounded-r-none border-r-0" />

            <Select.Root
              selected={{ value: item.direction, label: item.direction }}
              onSelectedChange={(value) => {
                if (value) {
                  item.direction = value.value
                }
              }}
            >
              <Select.Trigger class="h-8 w-[90px] rounded-l-none">
                <Select.Value />
              </Select.Trigger>
              <Select.Content class="text-sm">
                <Select.Item value="asc">
                  <ArrowDownAzIcon class="mr-1 h-3 w-3" />
                  asc
                </Select.Item>
                <Select.Item value="desc">
                  <ArrowUpZaIcon class="mr-1 h-4 w-4" />
                  desc
                </Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        {/each}
      </div>
    {/if}
    <div class="px-4 py-1">
      <Button variant="ghost" size="sm" on:click={addSort}>Add Sort</Button>
    </div>
  </Popover.Content>
</Popover.Root>

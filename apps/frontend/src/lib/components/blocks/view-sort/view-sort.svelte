<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import * as Select from "$lib/components/ui/select"
  import Badge from "$lib/components/ui/badge/badge.svelte"
  import { ArrowDownAzIcon, ArrowUpDownIcon, ArrowUpZaIcon } from "lucide-svelte"
  import { cn } from "$lib/utils"

  import { getTable } from "$lib/store/table.store"
  import { type IViewSort, isFieldSortable } from "@undb/table"
  import FieldPicker from "../field-picker/field-picker.svelte"
  import { createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { invalidateAll } from "$app/navigation"

  const table = getTable()
  $: view = $table.views.getViewById()
  $: sort = view.sort.into(undefined)
  $: fields = $table.getOrderedFields()

  $: count = sort?.count ?? 0

  let value: IViewSort = sort?.value ?? []
  $: if (!value.length && sort?.value.length) {
    value = sort.value
  }
  $: selectedFieldIds = value.reduce((acc, item) => acc.add(item.fieldId), new Set<string>())
  $: availableFields = fields.filter((f) => !selectedFieldIds.has(f.id.value))

  let open = false

  function addSort() {
    if (!availableFields.length) {
      return
    }
    value = [...value, { fieldId: availableFields[0].id.value, direction: "asc" }]
  }

  const setViewSortMutation = createMutation({
    mutationKey: [$table.id.value, "setSort"],
    mutationFn: trpc.table.view.setSort.mutate,
    onSettled() {
      invalidateAll()
      open = false
    },
  })

  function submit() {
    $setViewSortMutation.mutate({
      tableId: $table.id.value,
      viewId: view.id.value,
      sort: value,
    })
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
          <div class="grid w-full grid-cols-6 items-center">
            <FieldPicker
              filter={(field) => !selectedFieldIds.has(field.value) && isFieldSortable(field.value)}
              }
              bind:value={item.fieldId}
              class="col-span-4 rounded-r-none border-r-0"
            />

            <Select.Root
              selected={{ value: item.direction, label: item.direction }}
              onSelectedChange={(value) => {
                if (value) {
                  item.direction = value.value
                }
              }}
            >
              <Select.Trigger class="col-span-2 h-8 rounded-l-none">
                <Select.Value asChild let:label>
                  <div class="flex items-center gap-2">
                    {#if label === "asc"}
                      <ArrowDownAzIcon class="mr-1 h-3 w-3" />
                    {:else}
                      <ArrowUpZaIcon class="mr-1 h-4 w-4" />
                    {/if}
                    <span>
                      {label}
                    </span>
                  </div>
                </Select.Value>
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
    <div class="flex w-full items-center justify-between px-4 py-1">
      {#if availableFields.length}
        <Button variant="ghost" size="sm" on:click={addSort}>Add Sort</Button>
      {/if}
      <Button variant="outline" size="xs" on:click={submit}>submit</Button>
    </div>
  </Popover.Content>
</Popover.Root>

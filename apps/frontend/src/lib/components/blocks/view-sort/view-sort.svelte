<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { Button } from "$lib/components/ui/button/index.js"
  import * as Select from "$lib/components/ui/select"
  import Badge from "$lib/components/ui/badge/badge.svelte"
  import {
    ArrowDownAzIcon,
    ArrowUpDownIcon,
    ArrowUpZaIcon,
    GripVerticalIcon,
    Trash2Icon,
    PlusIcon,
  } from "lucide-svelte"
  import { cn } from "$lib/utils"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"

  import { getTable, viewId } from "$lib/store/table.store"
  import { type IViewSort, isFieldSortable } from "@undb/table"
  import FieldPicker from "../field-picker/field-picker.svelte"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { invalidate } from "$app/navigation"
  import { isNumber } from "radash"
  import { onMount } from "svelte"
  import autoAnimate from "@formkit/auto-animate"

  const table = getTable()
  $: view = $table.views.getViewById($viewId)
  $: sort = view.sort.into(undefined)
  $: fields = $table.getOrderedFields()

  $: count = sort?.count ?? 0

  let value: IViewSort = sort?.value ?? []
  onMount(() => {
    if (!value.length && sort?.value.length) {
      value = sort.value
    }
  })
  $: selectedFieldIds = value.reduce((acc, item) => acc.add(item.fieldId), new Set<string>())
  $: availableFields = fields.filter((f) => !selectedFieldIds.has(f.id.value))
  $: disabled = availableFields.length === 0

  let open = false

  function addSort() {
    if (disabled) {
      return
    }
    value = [...value, { fieldId: availableFields[0].id.value, direction: "asc" }]
  }

  const client = useQueryClient()
  const setViewSortMutation = createMutation({
    mutationKey: ["table", $table.id.value, "setSort"],
    mutationFn: trpc.table.view.setSort.mutate,
    async onSettled() {
      await invalidate(`table:${$table.id.value}`)
      await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
      open = false
    },
  })

  function submit() {
    $setViewSortMutation.mutate({
      tableId: $table.id.value,
      viewId: $viewId,
      sort: value,
    })
  }

  function removeSort(fieldId: string): void {
    value = value.filter((item) => item.fieldId !== fieldId)
  }

  function swapSort(oldIndex: number, newIndex: number) {
    if (value) {
      const filters = [...value]
      const [removed] = filters.splice(oldIndex, 1)
      filters.splice(newIndex, 0, removed)
      value = [...filters]
    }
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger asChild let:builder>
    <Button variant={count || open ? "secondary" : "ghost"} builders={[builder]} size="sm">
      <ArrowUpDownIcon class="mr-2 h-4 w-4" />
      Sorts
      {#if count}
        <Badge variant="secondary" class="ml-2 rounded-full">{count}</Badge>
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[400px] p-0 shadow-2xl" align="start">
    <div use:autoAnimate class="h-full w-full">
      {#if value?.length}
        <div class="space-y-2 border-b px-4 py-2">
          <div class="text-muted-foreground text-xs">Sorts</div>
          <SortableList
            class={cn("space-y-1.5")}
            animation={200}
            onEnd={(event) => {
              if (isNumber(event.oldIndex) && isNumber(event.newIndex)) {
                swapSort(event.oldIndex, event.newIndex)
              }
            }}
          >
            {#each value as item, i (item.fieldId)}
              <div class="grid w-full grid-cols-12 items-center gap-2">
                <div class="col-span-10 grid grid-cols-8">
                  <FieldPicker
                    filter={(field) => !selectedFieldIds.has(field.value) && isFieldSortable(field.type)}
                    bind:value={item.fieldId}
                    class="col-span-5 rounded-r-none border-r-0"
                  />

                  <Select.Root
                    selected={{ value: item.direction, label: item.direction }}
                    onSelectedChange={(value) => {
                      if (value) {
                        item.direction = value.value
                      }
                    }}
                  >
                    <Select.Trigger class="col-span-3 h-8 rounded-l-none">
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
                <div class="text-muted-foreground col-span-2 flex justify-end gap-2">
                  <button on:click={() => removeSort(item.fieldId)}>
                    <Trash2Icon class="h-3 w-3" />
                  </button>
                  <button class=".handler" on:click={() => removeSort(item.fieldId)}>
                    <GripVerticalIcon class="h-3 w-3" />
                  </button>
                </div>
              </div>
            {/each}
          </SortableList>
        </div>
      {/if}
      <div class="flex w-full items-center justify-between px-4 py-3">
        <Button {disabled} variant="ghost" size="sm" on:click={addSort}>
          <PlusIcon class="mr-2 h-3 w-3" />
          Add Sort
        </Button>
        <Button variant="outline" size="sm" on:click={submit}>Submit</Button>
      </div>
    </div>
  </Popover.Content>
</Popover.Root>

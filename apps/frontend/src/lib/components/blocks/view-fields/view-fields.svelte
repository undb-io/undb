<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Switch } from "$lib/components/ui/switch"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import * as Popover from "$lib/components/ui/popover"
  import { getTable, viewId } from "$lib/store/table.store"
  import { FieldIdVo } from "@undb/table"
  import { ListIcon, GripVerticalIcon, SearchIcon } from "lucide-svelte"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { tick } from "svelte"
  import { invalidate } from "$app/navigation"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"
  import { isNumber } from "radash"
  import { Input } from "$lib/components/ui/input"
  import { writable } from "svelte/store"
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte"

  const table = getTable()
  $: fields = $table.getOrderedFields(undefined, $viewId)
  $: viewFieldsVo = $table.getViewFields($viewId)
  $: viewFields = viewFieldsVo.props.filter((viewField) => fields.some((field) => field.id.value === viewField.fieldId))
  $: hiddenCount = viewFieldsVo.getHiddenFieldsCount()
  $: visibleCount = viewFieldsVo.getVisibleFieldsCount()

  let open = false
  const q = writable("")

  $: filteredViewFields = viewFields.filter((viewField) => {
    const field = $table.schema.getFieldById(new FieldIdVo(viewField.fieldId)).into(undefined)
    return field && field.name.value.toLowerCase().includes($q.toLowerCase())
  })

  const client = useQueryClient()
  const setViewFieldsMutation = createMutation({
    mutationFn: trpc.table.view.setFields.mutate,
    mutationKey: ["table", $table.id.value, "setFields"],
    async onSuccess(data, variables, context) {
      await invalidate(`table:${$table.id.value}`)
      await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
    },
  })

  const setViewFields = async () => {
    await tick()
    $setViewFieldsMutation.mutate({
      tableId: $table.id.value,
      viewId: $viewId,
      fields: [...viewFields],
    })
  }

  function swapFields(oldIndex: number, newIndex: number) {
    const fields = [...viewFields]
    const [removed] = fields.splice(oldIndex, 1)
    fields.splice(newIndex, 0, removed)
    viewFields = [...fields]

    setViewFields()
  }

  $: viewOption = $table.getViewOption($viewId)

  const setViewOptionMutation = createMutation({
    mutationFn: trpc.table.view.setOption.mutate,
    mutationKey: ["table", $table.id.value, "setOption"],
    async onSuccess(data, variables, context) {
      await invalidate(`table:${$table.id.value}`)
      client.invalidateQueries({ queryKey: ["records", $table.id.value] })
    },
  })

  const setViewOption = async (value: boolean) => {
    viewOption.showSystemFields = value
    await tick()
    $setViewOptionMutation.mutate({
      tableId: $table.id.value,
      viewId: $table.views.getViewById($viewId).id.value,
      option: viewOption.toJSON(),
    })
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger asChild let:builder>
    <Button variant={open || !!hiddenCount ? "secondary" : "ghost"} builders={[builder]} size="sm">
      <ListIcon class="mr-2 h-4 w-4" />
      {#if !!hiddenCount}
        {hiddenCount} Fields hidden
      {:else}
        Fields
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="p-2">
    <div class="-mx-2 flex items-center gap-0 border-b pb-2">
      <div class="flex h-full w-9 items-center justify-center">
        <SearchIcon class="text-muted-foreground h-4 w-4" />
      </div>
      <Input
        autofocus
        class="h-full flex-1 rounded-none border-0 border-none pl-0 shadow-none focus-visible:ring-0"
        placeholder={`Search ${$table.name.value} fields...`}
        bind:value={$q}
      />
    </div>
    <div>
      <ScrollArea class="-mx-2 h-[400px]">
        <SortableList
          class="h-full p-2"
          animation={200}
          handle=".handler"
          onEnd={(event) => {
            if (isNumber(event.oldIndex) && isNumber(event.newIndex)) {
              swapFields(event.oldIndex, event.newIndex)
            }
          }}
        >
          {#each filteredViewFields as viewField (viewField.fieldId)}
            {@const field = $table.schema.getFieldById(new FieldIdVo(viewField.fieldId)).into(undefined)}
            {#if field}
              <div class="hover:bg-muted flex items-center justify-between rounded-sm p-2 transition-colors">
                <div class="flex items-center gap-2">
                  <Switch
                    disabled={visibleCount === 1 && viewFields.length === 1}
                    checked={!viewField.hidden}
                    onCheckedChange={(checked) => {
                      viewField.hidden = !checked
                      setViewFields()
                    }}
                  />
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <FieldIcon {field} type={field.type} class="h-3 w-3" />
                    {field.name.value}
                  </div>
                </div>
                <button class="text-muted-foreground handler">
                  <GripVerticalIcon class="h-3 w-3" />
                </button>
              </div>
            {/if}
          {/each}
        </SortableList>
      </ScrollArea>

      <div class="-mx-2 flex items-center gap-2 border-t bg-gray-50 px-2 pt-2 shadow-inner">
        {#if hiddenCount > 0}
          <Button
            variant="outline"
            class="flex-1 shadow-sm"
            size="sm"
            on:click={() => {
              viewFields = viewFieldsVo.showAllFields().toJSON()
              setViewFields()
            }}
          >
            Show all fields
          </Button>
        {:else}
          <Button
            variant="outline"
            class="flex-1 shadow-sm"
            size="sm"
            on:click={() => {
              viewFields = viewFieldsVo.hideAllFields().toJSON()
              setViewFields()
            }}
          >
            Hide all fields
          </Button>
        {/if}

        <Button
          variant="outline"
          class="flex-1 shadow-sm"
          size="sm"
          on:click={() => {
            viewOption.showSystemFields = !viewOption.showSystemFields
            setViewOption(viewOption.showSystemFields)
          }}
        >
          {viewOption.showSystemFields ? "Hide" : "Show"} system fields
        </Button>
      </div>
    </div>
  </Popover.Content>
</Popover.Root>

<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Switch } from "$lib/components/ui/switch"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import * as Popover from "$lib/components/ui/popover"
  import { getTable } from "$lib/store/table.store"
  import { FieldIdVo } from "@undb/table"
  import { ListIcon, GripVerticalIcon, SearchIcon, ChevronDownIcon } from "lucide-svelte"
  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { tick } from "svelte"
  import { invalidate } from "$app/navigation"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"
  import { isNumber } from "radash"
  import { Input } from "$lib/components/ui/input"
  import { writable, type Readable } from "svelte/store"
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte"
  import FieldMenu from "../field/field-menu.svelte"
  import { hasPermission } from "$lib/store/space-member.store"
  import CreateFieldButton from "../create-field/create-field-button.svelte"
  import { LL } from "@undb/i18n/client"
  import { EyeIcon, EyeOffIcon } from "lucide-svelte"
  import { getDataService } from "$lib/store/data-service.store"

  export let readonly = false
  export let viewId: Readable<string | undefined>

  const table = getTable()
  $: fields = $table.getOrderedFields(undefined, $viewId)
  $: viewFieldsVo = $table.getViewFields($viewId)
  $: viewFields = viewFieldsVo.props.filter((viewField) => fields.some((field) => field.id.value === viewField.fieldId))
  $: hiddenCount = viewFieldsVo.getHiddenFieldsCount()
  $: visibleCount = viewFieldsVo.getVisibleFieldsCount()

  let open = false
  let fieldOpen: Record<string, boolean> = {}
  let update = false

  const q = writable("")

  $: filteredViewFields = viewFields.filter((viewField) => {
    const field = $table.schema.getFieldById(new FieldIdVo(viewField.fieldId)).into(undefined)
    return field && field.name.value.toLowerCase().includes($q.toLowerCase())
  })

  const dataService = getDataService()

  const client = useQueryClient()
  const setViewFieldsMutation = createMutation({
    mutationFn: dataService.table.view.setFields,
    mutationKey: ["table", $table.id.value, "setFields"],
    async onSuccess(data, variables, context) {
      await invalidate(`undb:table:${$table.id.value}`)
      await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
    },
  })

  const setViewFields = async () => {
    if (readonly) return

    await tick()
    $setViewFieldsMutation.mutate({
      tableId: $table.id.value,
      viewId: $viewId,
      fields: [...viewFields],
    })
  }

  function swapFields(oldIndex: number, newIndex: number) {
    if (readonly) return
    const fields = [...viewFields]
    const [removed] = fields.splice(oldIndex, 1)
    fields.splice(newIndex, 0, removed)
    viewFields = [...fields]

    setViewFields()
  }

  $: viewOption = $table.getViewOption($viewId)

  const setViewOptionMutation = createMutation({
    mutationFn: dataService.table.view.setOption,
    mutationKey: ["table", $table.id.value, "setOption"],
    async onSuccess(data, variables, context) {
      await invalidate(`undb:table:${$table.id.value}`)
      client.invalidateQueries({ queryKey: ["records", $table.id.value] })
    },
  })

  const setViewOption = async (value: boolean) => {
    if (readonly) return

    viewOption.showSystemFields = value
    await tick()
    $setViewOptionMutation.mutate({
      tableId: $table.id.value,
      viewId: $table.views.getViewById($viewId).id.value,
      option: viewOption.toJSON(),
    })
  }
</script>

<Popover.Root bind:open portal="body">
  <Popover.Trigger asChild let:builder>
    <Button variant={open || !!hiddenCount ? "secondary" : "ghost"} builders={[builder]} size="sm" {...$$restProps}>
      <ListIcon class="mr-2 h-4 w-4" />
      {#if !!hiddenCount}
        {$LL.table.field.hidden({ n: hiddenCount })}
      {:else}
        {$LL.table.field.fields()}
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
        class="h-full flex-1 rounded-none border-0 border-none pl-0 text-sm shadow-none focus-visible:ring-0"
        placeholder={$LL.table.field.searchTableFields({ table: $table.name.value })}
        bind:value={$q}
      />
    </div>
    <div>
      <ScrollArea class="-mx-2 h-[400px]">
        <SortableList
          class="h-full p-2"
          animation={200}
          handle=".handler"
          disabled={readonly}
          onEnd={(event) => {
            if (isNumber(event.oldIndex) && isNumber(event.newIndex)) {
              swapFields(event.oldIndex, event.newIndex)
            }
          }}
        >
          {#each filteredViewFields as viewField (viewField.fieldId)}
            {@const field = $table.schema.getFieldById(new FieldIdVo(viewField.fieldId)).into(undefined)}
            {#if field}
              <div class="hover:bg-muted flex items-center justify-between rounded-sm p-1.5 transition-colors">
                <div class="flex items-center gap-2">
                  <Switch
                    size="sm"
                    disabled={(visibleCount === 1 && viewFields.length === 1) ||
                      !$hasPermission("table:update") ||
                      readonly}
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
                <div class="inline-flex items-center gap-1">
                  {#if $hasPermission("table:update") && !readonly}
                    <button class="text-muted-foreground handler">
                      <GripVerticalIcon class="h-3 w-3" />
                    </button>
                  {/if}

                  <Popover.Root
                    portal="body"
                    onOpenChange={(open) => {
                      if (!open) {
                        update = false
                      }
                    }}
                  >
                    <Popover.Trigger>
                      {#if $hasPermission("field:create") || $hasPermission("field:update") || $hasPermission("field:delete")}
                        <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
                      {/if}
                    </Popover.Trigger>

                    <FieldMenu bind:update bind:open={fieldOpen[field.id.value]} {field} />
                  </Popover.Root>
                </div>
              </div>
            {/if}
          {/each}
        </SortableList>
      </ScrollArea>

      {#if $hasPermission("table:update")}
        <div class="-mx-2 space-y-2 border-t bg-gray-50 px-2 pt-2 shadow-inner">
          <CreateFieldButton class="w-full" />
          <div class="flex w-full items-center gap-2">
            {#if hiddenCount > 0}
              <Button
                variant="outline"
                class="flex-1 gap-2 truncate shadow-sm"
                size="sm"
                on:click={() => {
                  viewFields = viewFieldsVo.showAllFields($table).toJSON()
                  setViewFields()
                }}
              >
                <EyeIcon class="h-3 w-3" />
                {$LL.table.view.field.showAllFields()}
              </Button>
            {:else}
              <Button
                variant="outline"
                class="flex-1 gap-2 truncate shadow-sm"
                size="sm"
                on:click={() => {
                  viewFields = viewFieldsVo.hideAllFields($table).toJSON()
                  setViewFields()
                }}
              >
                <EyeOffIcon class="h-3 w-3" />
                {$LL.table.view.field.hideAllFields()}
              </Button>
            {/if}

            <Button
              variant="outline"
              class="flex-1 gap-2 truncate shadow-sm"
              size="sm"
              on:click={() => {
                viewOption.showSystemFields = !viewOption.showSystemFields
                setViewOption(viewOption.showSystemFields)
              }}
            >
              {#if viewOption.showSystemFields}
                <EyeOffIcon class="h-3 w-3" />
              {:else}
                <EyeIcon class="h-3 w-3" />
              {/if}
              {viewOption.showSystemFields
                ? $LL.table.view.field.hideSystemFields()
                : $LL.table.view.field.showSystemFields()}
            </Button>
          </div>
        </div>
      {/if}
    </div>
  </Popover.Content>
</Popover.Root>

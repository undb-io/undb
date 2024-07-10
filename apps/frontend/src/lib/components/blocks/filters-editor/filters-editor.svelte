<script lang="ts">
  import {
    TableDo,
    isMaybeFieldCondition,
    isMaybeGroup,
    type MaybeFieldCondition,
    type MaybeConditionGroup,
    FieldIdVo,
    type Conjunction,
    type FieldType,
  } from "@undb/table"
  import FilterField from "./filter-field.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { cn } from "$lib/utils"
  import { GripVertical, PlusIcon, Trash2Icon } from "lucide-svelte"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"
  import ConjunctionPicker from "./conjunction-picker.svelte"
  import { isNumber, uid } from "radash"
  import FieldFilterControl from "./field-filter-control.svelte"

  interface IField {
    id: string
    type: FieldType
  }

  export let table: TableDo
  export let value: MaybeConditionGroup<any> | undefined = undefined
  export let level = 1
  export let defaultConjunction: Conjunction = "and"
  export let filter: (field: IField) => boolean = () => true

  $: filteredFields = table.getOrderedVisibleFields().filter((f) => filter({ id: f.id.value, type: f.type }))
  export let disableGroup = false

  $: isEven = level % 2 === 0

  function addCondition() {
    const field = filteredFields.at(0)
    if (!field) return

    const conditionOps = field?.conditionOps ?? []
    const filter: MaybeFieldCondition = {
      id: uid(10),
      fieldId: field?.id.value,
      op: conditionOps?.[0] as any,
      value: undefined,
    }
    if (!value) {
      value = { children: [filter], conjunction: defaultConjunction, id: uid(10) }
    } else {
      value.children = [...value.children, filter]
    }
  }

  function addConditionGroup() {
    const conditionGroup: MaybeConditionGroup<any> = {
      id: uid(10),
      conjunction: defaultConjunction,
      children: [],
    }
    if (!value) {
      value = { children: [conditionGroup], conjunction: defaultConjunction, id: uid(10) }
    } else {
      value.children = [...value.children, conditionGroup]
    }
  }

  function removeFilter(index: number) {
    if (value) {
      value.children.splice(index, 1)
      value.children = [...value.children]
    }
  }

  function swapFilter(oldIndex: number, newIndex: number) {
    if (value) {
      const filters = [...value.children]
      const [removed] = filters.splice(oldIndex, 1)
      filters.splice(newIndex, 0, removed)
      value.children = [...filters]
    }
  }
</script>

<div class={cn("space-y-2", isEven ? "bg-muted" : "bg-popover", $$restProps.class)} data-level={level}>
  {#if value?.children.length}
    <SortableList
      class={cn("space-y-1.5", level > 1 ? "p-4 pb-2" : "px-4 py-2")}
      animation={200}
      onEnd={(event) => {
        if (isNumber(event.oldIndex) && isNumber(event.newIndex)) {
          swapFilter(event.oldIndex, event.newIndex)
        }
      }}
    >
      {#each value.children as child, i (child.id)}
        {#if isMaybeFieldCondition(child)}
          {@const field = child.fieldId
            ? table.schema.getFieldById(new FieldIdVo(child.fieldId)).into(undefined)
            : undefined}
          <div class="grid grid-cols-12 items-center gap-2">
            {#if i === 0 || disableGroup}
              <div class="item-center col-span-2 flex gap-2">
                <slot name="option" index={i} option={child} onChange={(option) => (child.option = option)} />
                <span class="flex flex-1 items-center justify-center text-center text-xs">Where</span>
              </div>
            {:else}
              <ConjunctionPicker
                disabled={i !== 1}
                class="col-span-2 bg-white text-center text-xs"
                bind:value={value.conjunction}
              />
            {/if}
            <div class="col-span-9 grid grid-cols-12 items-center">
              <FilterField {filter} bind:value={child.fieldId} class={cn("col-span-4 rounded-r-none border-r-0")} />
              <FieldFilterControl {field} bind:op={child.op} bind:value={child.value} />
            </div>
            <div class="col-span-1 flex items-center gap-2">
              <button type="button" on:click={() => removeFilter(i)}>
                <Trash2Icon class="text-muted-foreground h-3 w-3" />
              </button>
              <button type="button" class="handler">
                <GripVertical class="text-muted-foreground h-3 w-3" />
              </button>
            </div>
          </div>
        {:else if isMaybeGroup(child)}
          <div class="space-y-2">
            <div class="grid grid-cols-12 gap-2">
              <ConjunctionPicker
                disabled={i !== 1}
                class="col-span-2 bg-white text-center text-xs"
                bind:value={value.conjunction}
              />
              <div class="col-span-9"></div>
              <div class="col-span-1 flex items-center gap-2">
                <button
                  type="button"
                  on:click={(e) => {
                    e.stopPropagation()
                    removeFilter(i)
                  }}
                >
                  <Trash2Icon class="text-muted-foreground h-3 w-3" />
                </button>
                <button type="button" class="handler">
                  <GripVertical class="text-muted-foreground h-3 w-3" />
                </button>
              </div>
            </div>
            <svelte:self bind:value={child} {table} level={level + 1} />
          </div>
        {/if}
      {/each}
    </SortableList>
  {/if}
  <div class={cn("flex justify-between px-4", value?.children.length ? "border-t py-2" : "py-3")}>
    <div class="flex items-center gap-2">
      <Button disabled={!filteredFields.length} variant="ghost" size="sm" on:click={addCondition}>
        <PlusIcon class="mr-2 h-3 w-3" />
        Add Condition
      </Button>
      {#if !disableGroup}
        {#if level < 3}
          <Button
            disabled={!filteredFields.length}
            variant="ghost"
            class="text-muted-foreground"
            size="sm"
            on:click={addConditionGroup}
          >
            <PlusIcon class="mr-2 h-3 w-3" />
            Add Condition Group
          </Button>
        {/if}
      {/if}
    </div>

    <slot name="footer" />
  </div>
</div>

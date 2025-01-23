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
    addMaybeCondition,
    addMaybeConditionGroup,
    removeCondition,
    swapCondition,
  } from "@undb/table"
  import FilterField from "./filter-field.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { cn } from "$lib/utils"
  import { GripVertical, PlusIcon, Trash2Icon } from "lucide-svelte"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"
  import ConjunctionPicker from "./conjunction-picker.svelte"
  import { isNumber, uid } from "radash"
  import FieldFilterControl from "./field-filter-control.svelte"
  import autoAnimate from "@formkit/auto-animate"
  import { writable } from "svelte/store"
  import { hasPermission } from "$lib/store/space-member.store"
  import { LL } from "@undb/i18n/client"

  interface IField {
    id: string
    type: FieldType
  }

  export let table: TableDo
  export let value: MaybeConditionGroup<any> | undefined = undefined
  export let level = 1
  export let defaultConjunction: Conjunction = "and"
  export let filter: (field: IField) => boolean = () => true
  export let disabled = false
  export let readonly = false
  export let sameWidth = true

  export let onValueChange: ((value: MaybeConditionGroup<any> | undefined) => void) | undefined = undefined

  $: filteredFields = table?.getOrderedVisibleFields().filter((f) => filter({ id: f.id.value, type: f.type })) ?? []
  export let disableGroup = false

  $: isEven = level % 2 === 0

  function addCondition() {
    const field = filteredFields.at(0)
    if (!field) return

    const conditionOps = field?.conditionOps ?? []
    const filter: MaybeFieldCondition = {
      id: uid(10),
      field: field?.id.value,
      op: conditionOps?.[0] as any,
      value: undefined,
      option: {},
    }
      value = addMaybeCondition(value, filter, defaultConjunction)
  }

  function addConditionGroup() {
    const conditionGroup: MaybeConditionGroup<any> = {
      id: uid(10),
      conjunction: defaultConjunction,
      option: {},
      children: [],
    }
      value = addMaybeConditionGroup(value, conditionGroup, defaultConjunction)
  }

  function removeFilter(index: number) {
      value = removeCondition(value, index)
  }

  function swapFilter(oldIndex: number, newIndex: number) {
      value = swapCondition(value, oldIndex, newIndex)
  }
</script>

<div use:autoAnimate class={cn("space-y-2", isEven ? "bg-muted" : "bg-popover", $$restProps.class)} data-level={level}>
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
          {@const field = child.field
            ? table?.schema.getFieldById(new FieldIdVo(child.field)).into(undefined)
            : undefined}
          <div class="grid grid-cols-12 items-center gap-2">
            {#if i === 0 || disableGroup}
              <div class="item-center col-span-2 flex gap-2">
                <slot name="option" index={i} option={child} onChange={(option) => (child.option = option)} />
                <span class="flex flex-1 items-center justify-center text-center text-xs">
                  {$LL.table.common.where()}
                </span>
              </div>
            {:else}
              <ConjunctionPicker
                disabled={i !== 1 || disabled || readonly}
                class="col-span-2 bg-white text-center text-xs"
                bind:value={value.conjunction}
              />
            {/if}
            <div class="col-span-9 grid grid-cols-12 items-center">
              <FilterField
                {disabled}
                {readonly}
                table={table ? writable(table) : undefined}
                {sameWidth}
                onValueChange={async (field, prev) => {
                  if (isMaybeFieldCondition(child)) {
                    if (field !== prev) {
                      child.value = undefined
                    } else {
                      child.value = field
                    }

                    child = child
                    value = value
                    onValueChange?.(value)
                  }
                }}
                {filter}
                bind:value={child.field}
                class={cn("col-span-4 rounded-r-none border-r-0")}
              />
              <FieldFilterControl
                class="col-span-8 overflow-hidden"
                disabled={disabled || readonly}
                {field}
                bind:option={child.option}
                bind:op={child.op}
                bind:value={child.value}
                onOpChange={(o) => {
                  if (isMaybeFieldCondition(child)) {
                    child.op = o
                    child = child
                    value = value
                    onValueChange?.(value)
                  }
                }}
                onOptionChange={(o) => {
                  if (isMaybeFieldCondition(child)) {
                    child.option = o
                    child = child
                    value = value
                    onValueChange?.(value)
                  }
                }}
                onValueChange={(v) => {
                  if (isMaybeFieldCondition(child)) {
                    child.value = v
                    child = child
                    value = value
                    onValueChange?.(value)
                  }
                }}
              />
            </div>
            <div class="col-span-1 flex items-center gap-2">
              {#if !readonly && $hasPermission("table:update")}
                <button {disabled} type="button" on:click={() => removeFilter(i)}>
                  <Trash2Icon class="text-muted-foreground h-3 w-3" />
                </button>
                <button {disabled} type="button" class="handler">
                  <GripVertical class="text-muted-foreground h-3 w-3" />
                </button>
              {/if}
            </div>
          </div>
        {:else if isMaybeGroup(child)}
          <div class="space-y-2">
            <div class="grid grid-cols-12 gap-2">
              <ConjunctionPicker
                disabled={i !== 1 || disabled || readonly}
                class="col-span-2 bg-white text-center text-xs"
                bind:value={value.conjunction}
              />
              <div class="col-span-9"></div>
              <div class="col-span-1 flex items-center gap-2">
                {#if !readonly && $hasPermission("table:update")}
                  <button
                    {disabled}
                    type="button"
                    on:click={(e) => {
                      e.stopPropagation()
                      removeFilter(i)
                    }}
                  >
                    <Trash2Icon class="text-muted-foreground h-3 w-3" />
                  </button>
                  <button {disabled} type="button" class="handler">
                    <GripVertical class="text-muted-foreground h-3 w-3" />
                  </button>
                {/if}
              </div>
            </div>
            <svelte:self {onValueChange} bind:value={child} {table} level={level + 1} {readonly} {disabled} {filter} />
          </div>
        {/if}
      {/each}
    </SortableList>
  {:else if readonly}
    <slot name="empty" />
  {/if}
  {#if !readonly}
  <div class={cn("flex justify-between px-4", value?.children.length ? "border-t py-2" : "py-3")}>
    <div class="flex items-center gap-2">
      {#if ( !readonly && $hasPermission("table:update")) }
        <Button disabled={!filteredFields.length || disabled} variant="ghost" size="sm" on:click={addCondition}>
          <PlusIcon class="mr-2 h-3 w-3" />
          {$LL.table.common.condition.add()}
        </Button>
        {#if !disableGroup}
          {#if level < 3}
            <Button
              disabled={!filteredFields.length || disabled}
              variant="ghost"
              class="text-muted-foreground"
              size="sm"
              on:click={addConditionGroup}
            >
              <PlusIcon class="mr-2 h-3 w-3" />
              {$LL.table.common.condition.addGroup()}
            </Button>
          {/if}
        {/if}
      {/if}
    </div>

    {#if !readonly && $hasPermission("table:update")}
      <slot name="footer" />
    {/if}
  </div>
{/if}
</div>

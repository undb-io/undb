<script lang="ts">
  import { TableDo, FieldIdVo, type IConditionGroup, isFieldCondition, isGroup } from "@undb/table"
  import FilterField from "./filter-field.svelte"
  import OpPicker from "./op-picker.svelte"
  import FilterInput from "./filter-input.svelte"
  import { cn } from "$lib/utils"
  import ConjunctionPicker from "./conjunction-picker.svelte"

  export let table: TableDo
  export let value: IConditionGroup<any> | undefined = undefined
</script>

<div class={cn("space-y-2", $$restProps.class)}>
  {#if value?.children.length}
    <div class={cn("space-y-1.5")}>
      {#each value.children as child, i}
        {#if isFieldCondition(child)}
          {@const field = child.field
            ? table.schema.getFieldById(new FieldIdVo(child.field)).into(undefined)
            : undefined}
          <div class="grid grid-cols-12 items-center gap-2">
            {#if i === 0}
              <div class="item-center col-span-2 flex gap-2">
                <span class="flex flex-1 items-center justify-center text-center text-xs">Where</span>
              </div>
            {:else}
              <ConjunctionPicker disabled class="col-span-2 bg-white text-center text-xs" value={value.conjunction} />
            {/if}
            <div class="col-span-9 grid grid-cols-12 items-center">
              <FilterField
                disabled
                bind:value={child.field}
                class={cn(!!child.field && "col-span-4 rounded-r-none border-r-0")}
              />
              <OpPicker
                disabled
                {field}
                bind:value={child.op}
                class={cn("col-span-3 rounded-l-none", !!child.value && "rounded-r-none")}
              />
              <FilterInput
                disabled
                {field}
                bind:value={child.value}
                op={child.op}
                class="col-span-5 bg-white text-xs font-medium"
              />
            </div>
          </div>
        {:else if isGroup(child)}
          <div class="space-y-2">
            <div class="grid grid-cols-12 gap-2">
              <ConjunctionPicker disabled class="col-span-2 bg-white text-center text-xs" value={value.conjunction} />
              <div class="col-span-9"></div>
            </div>
            <svelte:self value={child} {table} />
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

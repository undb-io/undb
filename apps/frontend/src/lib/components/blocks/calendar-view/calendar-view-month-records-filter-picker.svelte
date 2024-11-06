<script lang="ts">
  import * as Select from "$lib/components/ui/select"
  import { monthStore } from "$lib/store/calendar.store"
  import type { MonthScope } from "$lib/store/calendar.store"
  import { cn } from "$lib/utils"

  const scopes: { value: MonthScope; label: string }[] = [
    { value: "selectedDate", label: "In selected date" },
    { value: "withoutDate", label: "Without date" },
    { value: "thisMonth", label: "In this month" },
    { value: "allRecords", label: "All records" },
  ]

  const scope = $monthStore.scope

  $: selected = {
    value: $scope,
    label: scopes.find((s) => s.value === $scope)?.label ?? "Select Scope",
  }

  function setScope(scope: MonthScope) {
    monthStore.setScope(scope)
  }
</script>

<Select.Root
  {selected}
  onSelectedChange={(s) => {
    if (s?.value) {
      setScope(s.value)
    }
  }}
  portal="body"
>
  <Select.Trigger {...$$restProps} class={cn("h-8 w-full", $$restProps.class)}>
    <Select.Value class="text-xs" placeholder="Select Scope">
      {selected.label}
    </Select.Value>
  </Select.Trigger>
  <Select.Content>
    {#each scopes as scope}
      <Select.Item class="text-xs" value={scope.value} label={scope.label}>
        {scope.label}
      </Select.Item>
    {/each}
  </Select.Content>
</Select.Root>

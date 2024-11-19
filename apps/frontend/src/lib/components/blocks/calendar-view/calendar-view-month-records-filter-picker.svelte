<script lang="ts">
  import * as Select from "$lib/components/ui/select"
  import { calendarStore } from "$lib/store/calendar.store"
  import { cn } from "$lib/utils"
  import { CalendarView, type Scope } from "@undb/table"

  export let view: CalendarView

  const scope = $calendarStore.scope
  $: scopes = view.scopes

  $: selected = {
    value: $scope,
    label: scopes.find((s) => s.value === $scope)?.label ?? "Select Scope",
  }

  function setScope(scope: Scope) {
    calendarStore.setScope(scope)
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

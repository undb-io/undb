<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js"
  import type { CalendarView } from "@undb/table"
  import SelectCalendarFieldForm from "./select-calendar-field-form.svelte"

  export let view: CalendarView
</script>

<Card.Root class="w-[450px]">
  <Card.Header>
    <Card.Title>Select calendar field</Card.Title>
    <Card.Description>Select a select type field to group calendar lanes.</Card.Description>
  </Card.Header>
  <Card.Content class="space-y-4">
    <SelectCalendarFieldForm bind:view />
  </Card.Content>
</Card.Root>

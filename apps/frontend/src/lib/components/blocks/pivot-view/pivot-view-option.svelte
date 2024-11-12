<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js"
  import type { PivotView } from "@undb/table"
  import PivotViewOptionForm from "./pivot-view-option-form.svelte"

  export let view: PivotView
</script>

<Card.Root class="w-[450px]">
  <Card.Header>
    <Card.Title>Config pivot view</Card.Title>
    <Card.Description>Configure pivot view column label, row label, value and aggregate.</Card.Description>
  </Card.Header>
  <Card.Content class="space-y-4">
    <PivotViewOptionForm {view} />
  </Card.Content>
</Card.Root>

<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js"
  import type { GalleryView } from "@undb/table"
  import GalleryViewFieldForm from "./gallery-view-field-form.svelte"

  export let view: GalleryView
</script>

<div class="flex h-full w-full items-center justify-center">
  <Card.Root class="w-[450px]">
    <Card.Header>
      <Card.Title>Select gallery field</Card.Title>
      <Card.Description>Select a attachment type field to display images.</Card.Description>
    </Card.Header>
    <Card.Content class="space-y-4">
      <GalleryViewFieldForm {view} />
    </Card.Content>
  </Card.Root>
</div>

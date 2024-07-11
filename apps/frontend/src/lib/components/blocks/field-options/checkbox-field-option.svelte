<script lang="ts">
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"
  import { Label } from "$lib/components/ui/label/index.js"

  export let defaultValue: boolean | undefined
</script>

<div class="space-y-4">
  <div class="grid gap-3">
    <Label for="defaultValue">Default</Label>
    <Checkbox id="defaultValue" class="bg-background flex-1" placeholder="default value" bind:checked={defaultValue} />
  </div>
</div>

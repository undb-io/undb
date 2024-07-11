<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"
  import { Label } from "$lib/components/ui/label/index.js"

  export let defaultValue: boolean | undefined
</script>

<div class="space-y-1">
  <Label for="defaultValue" class="block text-xs font-normal">Default value</Label>
  <Button
    variant="outline"
    class="flex w-full justify-start"
    on:click={() => {
      defaultValue = !defaultValue
    }}
  >
    <Checkbox checked={defaultValue} id="defaultValue" class="bg-background" placeholder="default value" />
  </Button>
</div>

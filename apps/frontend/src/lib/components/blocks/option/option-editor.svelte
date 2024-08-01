<script lang="ts">
  import type { IColors, IOptionName } from "@undb/table"
  import { Input } from "$lib/components/ui/input"
  import ColorPicker from "$lib/components/ui/color-picker/color-picker.svelte"

  export let color: IColors
  export let name: IOptionName
</script>

<div class="flex flex-1 items-center gap-2">
  <ColorPicker bind:value={color} onColorChange={(value) => (color = value)} />
  <Input class="bg-background text-xs" bind:value={name} />
</div>

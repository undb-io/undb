<script lang="ts">
  import type { IColors, IOptionName } from "@undb/table"
  import { Input } from "$lib/components/ui/input"
  import ColorPicker from "$lib/components/ui/color-picker/color-picker.svelte"
  import type { Props } from "$lib/components/ui/color-picker"

  export let color: IColors
  export let name: IOptionName
  export let disabled: boolean = false

  export let onColorChange: Props["onColorChange"] = undefined
  export let onNameChange: ((name: string) => void) | undefined = undefined
</script>

<div class="flex flex-1 items-center gap-2">
  <ColorPicker
    {disabled}
    bind:value={color}
    onColorChange={(value) => {
      onColorChange?.(value)
      color = value
    }}
  />
  <Input
    {disabled}
    class="bg-background text-xs"
    bind:value={name}
    autofocus
    on:input={(v) => onNameChange?.(v.target.value)}
  />
</div>

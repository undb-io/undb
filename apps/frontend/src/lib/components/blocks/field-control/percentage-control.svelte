<script lang="ts">
  import { Slider } from "$lib/components/ui/slider"
  import * as Tooltip from "$lib/components/ui/tooltip"

  export let readonly = false
  export let value: number | undefined
  export let onValueChange: (value: number) => void

  function onChange(nums: number[]) {
    value = nums[0] / 100
    onValueChange?.(value)
  }
</script>

<Tooltip.Root>
  <Tooltip.Trigger class="w-full">
    <div class="flex h-full items-center">
      <Slider
        disabled={readonly}
        value={[(value ?? 0) * 100]}
        onValueChange={onChange}
        max={100}
        step={1}
        {...$$restProps}
      />
    </div>
  </Tooltip.Trigger>
  <Tooltip.Content>
    <p>{value}</p>
  </Tooltip.Content>
</Tooltip.Root>

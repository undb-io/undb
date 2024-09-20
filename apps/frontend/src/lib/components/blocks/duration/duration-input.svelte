<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"
  import { durationToMilliseconds, isDurationString, millisecondsToDuration } from "@undb/table"

  export let value: number | undefined
  export let onValueChange: ((value: number) => void) | undefined = undefined

  let internalValue = value ? millisecondsToDuration(value) : ""

  export let isValid = true

  function onChange(event: Event) {
    const valueString = (event.target as HTMLInputElement).value
    if (!isDurationString(valueString)) {
      isValid = false
      return
    }

    isValid = true

    internalValue = valueString

    value = durationToMilliseconds(valueString)
    onValueChange?.(value)
  }
</script>

<Input placeholder="hh:mm" value={internalValue} on:change={onChange} {...$$restProps} />

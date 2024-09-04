<script lang="ts">
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

<input value={internalValue} on:change={onChange} {...$$restProps} />

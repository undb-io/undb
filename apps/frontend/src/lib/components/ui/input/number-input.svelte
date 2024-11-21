<script lang="ts">
  import Input from "./input.svelte"

  export let value: number | undefined
  export let onValueChange: ((value: number) => void) | undefined = undefined

  function onInput(e: Event) {
    const v = Number((e.target as HTMLInputElement).value)
    value = v
    onValueChange?.(v)
  }
</script>

<Input {...$$restProps} type="number" {value} on:change on:input={onInput} />

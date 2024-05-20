<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"

  export let value: number
  const onInput = (event: Event) => {
    value = +(event.target as HTMLInputElement).value
    onValueChange(value)
  }
  export let onValueChange = (value: number) => {}
</script>

<Input {...$$restProps} {value} on:blur={onInput} type="number" />

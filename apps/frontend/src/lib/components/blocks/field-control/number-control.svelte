<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"

  export let value: number
  const onInput = (event: Event) => {
    value = +(event.target as HTMLInputElement).value
  }
</script>

<Input {...$$restProps} {value} on:input={onInput} type="number" />

<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"

  export let readonly = false
  export let value: number
  const onInput = (event: Event) => {
    value = +(event.target as HTMLInputElement).value
  }
</script>

<Input class={$$restProps.class} disabled={readonly} {value} on:input={onInput} type="number" on:change />

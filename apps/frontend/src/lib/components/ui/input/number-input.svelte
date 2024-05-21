<script lang="ts">
  import Input from "./input.svelte"

  export let value: number | undefined

  function onInput(e: Event) {
    value = +(e.target as HTMLInputElement).value
  }
</script>

<Input {...$$restProps} type="number" {value} on:input={onInput} />

<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements"
  import { Input, type InputEvents } from "."
  import { EyeIcon, EyeOffIcon } from "lucide-svelte"

  let show = false
  type $$Props = HTMLInputAttributes
  type $$Events = InputEvents

  let className: $$Props["class"] = undefined
  export let value: $$Props["value"] = undefined
  export { className as class }

  // Workaround for https://github.com/sveltejs/svelte/issues/9305
  // Fixed in Svelte 5, but not backported to 4.x.
  export let readonly: $$Props["readonly"] = undefined
</script>

<div class="relative">
  <Input
    class={className}
    bind:value
    {readonly}
    on:blur
    on:change
    on:click
    on:focus
    on:focusin
    on:focusout
    on:keydown
    on:keypress
    on:keyup
    on:mouseover
    on:mouseenter
    on:mouseleave
    on:paste
    on:input
    on:wheel
    {...$$restProps}
    type={show ? "text" : "password"}
  />
  <button
    tabindex="-1"
    type="button"
    class="text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2"
    on:click={() => (show = !show)}
  >
    {#if show}
      <EyeOffIcon class="h-5 w-5" />
    {:else}
      <EyeIcon class="h-5 w-5" />
    {/if}
  </button>
</div>

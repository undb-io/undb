<script lang="ts">
  import { setIsLocal } from "$lib/store/data-service.store"
  import { setIsPlayground } from "$lib/store/playground.svelte"
  import PlaygroundAlert from "$lib/components/blocks/playground/playground-alert.svelte"

  setIsLocal(true)
  setIsPlayground(true)
</script>

<main class="flex h-screen flex-col">
  <PlaygroundAlert />
  <slot />
</main>

{#await import("$lib/components/blocks/create-base/create-base-dialog.svelte") then { default: CreateBaseDialog }}
  <CreateBaseDialog baseNames={[]} />
{/await}

{#await import("$lib/components/blocks/template/template-list-sheet.svelte") then { default: TemplateListSheet }}
  <TemplateListSheet />
{/await}

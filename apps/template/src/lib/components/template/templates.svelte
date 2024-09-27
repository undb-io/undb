<script lang="ts">
  import TemplateCard from "./template-card.svelte"
  import type { ITemplateDTO } from "@undb/template"

  export let templates: ITemplateDTO[] = []
</script>

<section class="py-8">
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    {#each templates as template}
      <TemplateCard {template} />
    {/each}
  </div>
</section>

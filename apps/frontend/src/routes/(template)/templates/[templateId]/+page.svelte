<script lang="ts">
  import type { PageData } from "./$types"
  import TemplatePreview from "$lib/components/blocks/template/template-preview.svelte"
  import TemplateHeader from "$lib/components/blocks/template/template-header.svelte"

  export let data: PageData
</script>

<div class="flex h-full flex-col overflow-hidden">
  <TemplateHeader me={data.me} template={data.template} />

  <div class="flex-1 overflow-hidden">
    <TemplatePreview template={data.template} />
  </div>
</div>

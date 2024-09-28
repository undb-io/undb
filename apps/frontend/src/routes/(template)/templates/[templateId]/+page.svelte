<script lang="ts">
  import type { PageData } from "./$types"
  import TemplatePreview from "$lib/components/blocks/template/template-preview.svelte"

  export let data: PageData
</script>

<TemplatePreview template={data.template} />

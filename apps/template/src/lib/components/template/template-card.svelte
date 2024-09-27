<script lang="ts">
  import * as Card from "$lib/components/ui/card"
  import { AspectRatio } from "$lib/components/ui/aspect-ratio"
  import { MoveRightIcon } from "lucide-svelte"
  import type { ITemplateDTO } from "@undb/template"

  export let template: ITemplateDTO
</script>

<a href={`/template/${template.id}`}>
  <Card.Root>
    <Card.Content class="group flex min-h-[300px] flex-col p-0 shadow-sm transition-shadow hover:shadow-md">
      {template.name}
    </Card.Content>
  </Card.Root>
</a>

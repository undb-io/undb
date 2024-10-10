<script lang="ts">
  import { AspectRatio } from "$lib/components/ui/aspect-ratio"
  import { cn } from "$lib/utils"
</script>

<AspectRatio ratio={1}>
  <div class={cn("flex h-full w-full items-center justify-center rounded-lg bg-white p-6", $$restProps.class)}>
    <span class="text-9xl font-bold">50</span>
  </div>
</AspectRatio>

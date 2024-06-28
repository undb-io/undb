<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog"
  import { selectedAttachment } from "$lib/store/attachment.store"
  import { ExternalLinkIcon } from "lucide-svelte"
</script>

<Dialog.Root
  open={!!$selectedAttachment}
  onOpenChange={(open) => {
    if (!open) {
      $selectedAttachment = null
    }
  }}
>
  <Dialog.Content class="sm:max-w-1/2 max-w-1/2 !w-1/2 gap-0 space-y-0 p-0">
    <img class="h-full w-full" src={$selectedAttachment?.url} alt="Attachment" />
    <div class="bg-muted flex items-center gap-2 border-t p-4">
      <p>
        {$selectedAttachment?.name}
      </p>
      <a href={$selectedAttachment?.url} target="_blank">
        <ExternalLinkIcon class="text-muted-foreground h-4 w-4" />
      </a>
    </div>
  </Dialog.Content>
</Dialog.Root>

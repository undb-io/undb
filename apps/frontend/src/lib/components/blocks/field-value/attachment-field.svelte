<script lang="ts">
  import { isImage, type IAttachmentFieldValue } from "@undb/table"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { FileIcon } from "lucide-svelte"
  import { selectedAttachment } from "$lib/store/attachment.store"

  export let value: IAttachmentFieldValue | undefined = undefined
</script>

<span data-field-value={value}>
  {#if value}
    {#each value as v}
      <Tooltip.Root>
        <Tooltip.Trigger>
          <div class="h-5 w-5">
            {#if isImage(v)}
              <button on:click={() => ($selectedAttachment = v)}>
                <img src={v.signedUrl} alt={v.name} />
              </button>
            {:else}
              <FileIcon class="text-muted-foreground " />
            {/if}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content transitionConfig={{ duration: 100 }}>
          {v.name}
        </Tooltip.Content>
      </Tooltip.Root>
    {/each}
  {/if}
</span>

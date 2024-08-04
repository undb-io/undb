<script lang="ts">
  import { isImage, type AttachmentField, type IAttachmentFieldValue } from "@undb/table"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import Label from "$lib/components/ui/label/label.svelte"
  import { Maximize2Icon, PaperclipIcon, FileIcon, XIcon } from "lucide-svelte"
  import { selectedAttachment } from "$lib/store/attachment.store"
  import { cn } from "$lib/utils"
  import * as Dialog from "$lib/components/ui/dialog"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { AspectRatio } from "$lib/components/ui/aspect-ratio"

  export let tableId: string
  export let value: IAttachmentFieldValue | undefined = undefined
  export let isSelected: boolean
  export let field: AttachmentField
  export let recordId: string
  export let onValueChange: (value: IAttachmentFieldValue) => void

  $: max = field.max
  $: disabled = value?.length ?? 0 >= max

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  let open = false

  async function onChange(e: Event) {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (!files?.length) return

    const [file] = files

    const formData = new FormData()
    formData.append("files", file)

    const response = await fetch(`/api/upload/${tableId}`, {
      method: "POST",
      body: formData,
    })

    const json: { id: string; url: string; mimeType: string }[] = await response.json()
    if (json.length) {
      const [data] = json

      value = [
        ...(value ?? []),
        {
          id: data.id,
          url: data.url,
          type: data.mimeType,
          name: file.name,
          size: file.size,
        },
      ]

      onValueChange(value)

      $updateCell.mutate({
        tableId,
        id: recordId,
        values: { [field.id.value]: value },
      })
    }
  }

  function removeFile(i: number): any {
    value = value?.filter((_, index) => index !== i)

    $updateCell.mutate({
      tableId,
      id: recordId,
      values: { [field.id.value]: value ?? [] },
    })
  }
</script>

<div class={cn($$restProps.class, "flex items-center justify-center")}>
  {#if !value?.length}
    <Label
      role="button"
      class="hover:bg-primary/10 flex items-center gap-1 rounded-sm px-4 py-1 text-xs transition-colors"
    >
      <PaperclipIcon class="text-muted-foreground h-3 w-3" />
      Add File(s)
      <input type="file" hidden on:change={onChange} />
    </Label>
  {:else}
    <div class="flex w-full items-center justify-between gap-1 overflow-hidden">
      <div class="flex flex-1 items-center gap-1 overflow-hidden">
        {#if isSelected}
          <Label role="button" class="hover:bg-primary/10 cursor-pointer rounded-sm p-1 transition-colors">
            <PaperclipIcon class="text-muted-foreground h-3 w-3" />
            <input type="file" hidden on:change={onChange} />
          </Label>
        {/if}
        {#each value as v}
          <div class="flex h-5 w-5 items-center justify-center">
            {#if isImage(v)}
              <button on:click={() => ($selectedAttachment = v)}>
                <img src={v.url} alt={v.name} />
              </button>
            {:else}
              <FileIcon class="text-muted-foreground h-5 w-5" />
            {/if}
          </div>
        {/each}
      </div>
      {#if isSelected}
        <Dialog.Root
          bind:open
          onOpenChange={(open) => {
            if (!open) {
            }
          }}
        >
          <Dialog.Trigger>
            <button>
              <Maximize2Icon class="text-muted-foreground h-3 w-3" />
            </button>
          </Dialog.Trigger>
          <Dialog.Content class="max-h-[calc(100vh-40px)] max-w-3xl overflow-y-auto p-4 md:w-[700px]">
            <Dialog.Header class="flex flex-row items-center gap-2">
              <Label
                role="button"
                class="flex cursor-pointer items-center gap-2 rounded-sm border px-4 py-2 transition-colors hover:bg-gray-50"
              >
                <PaperclipIcon class="h-4 w-4" />
                Add File(s)
                <input type="file" hidden on:change={onChange} />
              </Label>

              Viewing Attachments of {field.name.value}
            </Dialog.Header>

            <div class="grid grid-cols-6 gap-2">
              {#each value as v, i}
                <div>
                  <AspectRatio
                    ratio={1}
                    class="group relative col-span-1 flex w-full items-center justify-center rounded-sm border"
                  >
                    {#if isImage(v)}
                      <button class="h-10 w-10" on:click={() => ($selectedAttachment = v)}>
                        <img src={v.url} alt={v.name} />
                      </button>
                    {:else}
                      <FileIcon class="text-muted-foreground h-10 w-10" />
                    {/if}

                    <AlertDialog.Root>
                      <AlertDialog.Trigger>
                        <button
                          class="absolute right-0 top-1 hidden -translate-y-1/2 translate-x-1/2 group-hover:block"
                        >
                          <XIcon class="text-muted-foreground h-5 w-5"></XIcon>
                        </button>
                      </AlertDialog.Trigger>
                      <AlertDialog.Content>
                        <AlertDialog.Header>
                          <AlertDialog.Title>Delete File</AlertDialog.Title>
                          <AlertDialog.Description>
                            Are you sure you want to delete the following file?
                            <div class="mt-2 rounded-sm border p-2">
                              {value[i].name}
                            </div>
                          </AlertDialog.Description>
                        </AlertDialog.Header>
                        <AlertDialog.Footer>
                          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                          <AlertDialog.Action
                            on:click={() => removeFile(i)}
                            class="bg-red-500 text-white hover:bg-red-600">Delete</AlertDialog.Action
                          >
                        </AlertDialog.Footer>
                      </AlertDialog.Content>
                    </AlertDialog.Root>
                  </AspectRatio>

                  <p title={v.name} class="mt-2 w-full truncate text-xs">
                    {v.name}
                  </p>
                </div>
              {/each}
            </div>
          </Dialog.Content>
        </Dialog.Root>
      {/if}
    </div>
  {/if}
</div>
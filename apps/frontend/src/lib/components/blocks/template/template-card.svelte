<script lang="ts">
  import * as Card from "$lib/components/ui/card"
  import { Button } from "$lib/components/ui/button"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import { invalidateAll, goto } from "$app/navigation"
  import { IMPORT_TEMPLATE_MODAL, closeModal } from "$lib/store/modal.store"
  import { FullscreenIcon } from "lucide-svelte"
  import { LoaderCircleIcon } from "lucide-svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import TemplatePreview from "./template-preview.svelte"
  import { Checkbox } from "$lib/components/ui/checkbox/index.js"
  import Label from "$lib/components/ui/label/label.svelte"
  import { LL } from "@undb/i18n/client"
  import { setDataService } from "$lib/store/data-service.store"
  import { DataService } from "@undb/data-service"
  import { getIsPlayground } from "$lib/store/playground.svelte"
  import { setTemplate } from "$lib/store/template.store.svelte"
  import { type ITemplateDTO } from "@undb/template"
  import { writable } from "svelte/store"

  export let dataService: DataService
  export let template: ITemplateDTO

  const isPlayground = getIsPlayground()

  setDataService(dataService)

  let includeData = !!isPlayground

  setTemplate(writable(template))

  const createFromTemplate = createMutation({
    mutationFn: dataService.template.createFromTemplate,
    async onSuccess(data, variables, context) {
      toast.success($LL.base.created())
      closeModal(IMPORT_TEMPLATE_MODAL)
      await invalidateAll()

      if (data.baseIds.length > 0) {
        if (isPlayground) {
          await goto(`/playground/bases/${data.baseIds[0]}`)
        } else {
          await goto(`/bases/${data.baseIds[0]}`)
        }
      }
    },
    onError(error) {
      toast.error(error.message)
    },
  })
</script>

<Card.Root class="group flex h-[180px] flex-col justify-between space-y-2 rounded-sm p-5">
  <Card.Header class="p-0">
    <Card.Title class="flex gap-2">
      <span class="-translate-y-1 self-start justify-self-start text-xl">{template.icon}</span>
      <div class="flex flex-col gap-2">
        <span>
          {template.name}
        </span>
        <div class="flex items-center gap-2">
          {#each template.categories as category}
            <span class="text-muted-foreground text-xs"># {category}</span>
          {/each}
        </div>
      </div>
    </Card.Title>
    <Card.Description class="line-clamp-2" title={template.description}>
      {template.description}
    </Card.Description>
  </Card.Header>
  <!-- <Card.Content class="p-0">
    <p>Card Content</p>
  </Card.Content> -->
  <Card.Footer class="p-0">
    <Dialog.Root portal="body">
      <Dialog.Trigger asChild let:builder>
        <Button
          builders={[builder]}
          variant="outline"
          class="w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          size="sm"
          disabled={$createFromTemplate.isPending}
        >
          <FullscreenIcon class="mr-2 size-4" />
          {$LL.template.previewTemplate()}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content class="flex h-[90%] !w-[90%] !max-w-none flex-col overflow-hidden">
        <Dialog.Header class="flex flex-row justify-between">
          <div class="space-y-2">
            <Dialog.Title>
              <span>
                {$LL.template.previewTemplate()}
                {template.name}
              </span>
            </Dialog.Title>
            <Dialog.Description class="max-w-4xl">
              {template.description}
            </Dialog.Description>
          </div>
          <div class="mr-10 flex flex-row gap-2">
            <div class="space-y-2">
              <Button
                class="w-44"
                disabled={$createFromTemplate.isPending}
                on:click={() => $createFromTemplate.mutate({ id: template.id, includeData })}
              >
                {#if $createFromTemplate.isPending}
                  <LoaderCircleIcon class="mr-2 size-4 animate-spin" />
                {/if}
                {$LL.template.useThisTemplate()}
              </Button>

              <div class="flex items-center space-x-2">
                <Checkbox id="terms" bind:checked={includeData} />
                <Label
                  for="terms"
                  class="text-xs font-medium leading-none text-gray-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {$LL.table.record.includeData()}
                </Label>
              </div>
            </div>

            <Button size="icon" href={`/templates/${template.id}`}>
              <FullscreenIcon class="size-4" />
            </Button>
          </div>
        </Dialog.Header>

        <div class="flex-1 overflow-auto rounded-sm border">
          <TemplatePreview {template} />
        </div>
      </Dialog.Content>
    </Dialog.Root>
  </Card.Footer>
</Card.Root>

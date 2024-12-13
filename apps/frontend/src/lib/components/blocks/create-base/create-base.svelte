<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { createMutation } from "@tanstack/svelte-query"
  import { superForm, defaults } from "sveltekit-superforms"
  import { createBaseCommand, type ICreateBaseCommand } from "@undb/commands"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { Input } from "$lib/components/ui/input"
  import { toast } from "svelte-sonner"
  import { CREATE_BASE_MODAL, closeModal } from "$lib/store/modal.store"
  import { goto, invalidateAll } from "$app/navigation"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { getNextName } from "@undb/utils"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"
  import { getIsPlayground } from "$lib/store/playground.svelte"

  const isPlayground = getIsPlayground()
  const dataService = getDataService()

  const mutation = createMutation({
    mutationFn: dataService.base.createBase,
    async onSuccess(data) {
      form.reset()
      if (isPlayground) {
        await goto(`/playground/bases/${data}`)
      } else {
        await goto(`/bases/${data}`)
        await invalidateAll()
      }
      closeModal(CREATE_BASE_MODAL)
      toast.success($LL.base.created())
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  export let baseNames: string[] = []

  const schema = createBaseCommand.omit({ spaceId: true })

  const form = superForm(
    defaults(
      {
        name: getNextName(baseNames, "Base"),
      },
      zodClient(schema),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(schema),
      resetForm: false,
      delayMs: 200,
      invalidateAll: true,
      onSubmit(event) {
        validateForm({ update: true })
      },
      async onUpdate(event) {
        if (!event.form.valid) return

        $mutation.mutate(event.form.data)
      },
    },
  )

  const { form: formData, enhance, delayed, validateForm } = form
</script>

<form id="createBase" class="space-y-2 px-1" method="POST" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>{$LL.common.name()}</Form.Label>
      <Input
        {...attrs}
        disabled={$mutation.isPending}
        bind:value={$formData.name}
        placeholder={$LL.base.displayName()}
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <div class="flex items-center justify-end gap-2">
    <Form.FormButton type="button" variant="secondary" on:click={() => closeModal(CREATE_BASE_MODAL)}>
      {$LL.common.cancel()}
    </Form.FormButton>
    <Form.FormButton disabled={$mutation.isPending}>
      {#if $delayed}
        <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
      {/if}
      {$LL.common.create()}
    </Form.FormButton>
  </div>
</form>

<!-- <div class="mt-2">
  <SuperDebug data={$formData} />
</div> -->

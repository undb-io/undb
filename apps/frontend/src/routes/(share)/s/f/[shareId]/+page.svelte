<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { FormIdVO, RecordDO, RecordIdVO } from "@undb/table"
  import * as Form from "$lib/components/ui/form"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { cn } from "$lib/utils"
  import autoAnimate from "@formkit/auto-animate"
  import Button from "$lib/components/ui/button/button.svelte"
  import { getFormBgColor } from "$lib/components/blocks/forms/form-bg-color"
  import FieldControl from "$lib/components/blocks/field-control/field-control.svelte"
  import { shareStore } from "$lib/store/share.store.svelte"
  import { page } from "$app/stores"
  import { closeModal, CREATE_RECORD_MODAL } from "$lib/store/modal.store"
  import { trpc } from "$lib/trpc/client"
  import { useQueryClient, createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import { derived } from "svelte/store"
  import { superForm, defaults } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { RocketIcon } from "lucide-svelte"
  import * as Alert from "$lib/components/ui/alert/index.js"

  $: share = $shareStore.get($page.params.shareId)
  $: formId = share?.target.id

  const table = getTable()
  const schema = $table.schema.getMutableSchema()

  $: form = formId ? $table.forms?.getFormById(formId) : undefined

  $: backgroundColor = form?.option?.backgroundColor

  $: fields = $table.getOrderedMutableFields(formId ? new FormIdVO(formId) : undefined)

  const client = useQueryClient()

  let submitted = false

  const createRecordMutation = createMutation(
    derived([table], ([$table]) => ({
      mutationFn: trpc.table.form.submit.mutate,
      onSuccess: () => {
        closeModal(CREATE_RECORD_MODAL)
        client.invalidateQueries({
          queryKey: ["records", $table.id.value],
        })
        toast.success("Form submitted")
        submitted = true
      },
      onError: (error: Error) => {
        toast.error(error.message)
      },
    })),
  )

  const createRecord = (values: any) => {
    const formId = form?.id
    if (!formId) {
      return
    }
    $createRecordMutation.mutate({
      tableId: $table.id.value,
      form: formId,
      values,
    })
  }

  const defaultValue = $table.getDefaultValues(formId ? new FormIdVO(formId) : undefined)
  $: $table, f.reset({ data: $table.getDefaultValues(formId ? new FormIdVO(formId) : undefined) })

  const f = superForm(defaults(defaultValue, zodClient(schema)), {
    SPA: true,
    dataType: "json",
    validators: zodClient(schema),
    resetForm: false,
    invalidateAll: false,
    onUpdate(event) {
      if (!event.form.valid) {
        return
      }

      createRecord(event.form.data)
    },
  })

  const { form: formData, enhance, allErrors, tainted } = f

  $: dirty = !!$tainted
  $: disabled = !!$allErrors.length || $createRecordMutation.isPending
  $: tempRecord = RecordDO.fromJSON($table, { id: RecordIdVO.create().value, values: $formData })
</script>

<main class={cn("min-h-full w-full bg-gray-50 transition-colors", backgroundColor && getFormBgColor(backgroundColor))}>
  {#if form}
    {#if submitted}
      <div class="flex h-screen w-full items-center justify-center">
        <div
          class={cn("bg-background mx-auto w-[800px] space-y-2 overflow-hidden rounded-2xl px-10 py-6 shadow-2xl")}
          data-form-id={form.id}
        >
          <h2 class="text-4xl font-extrabold tracking-tight">
            {form.name}
          </h2>

          <Alert.Root class="border-green-300 bg-green-50">
            <RocketIcon class="h-4 w-4" />
            <Alert.Title>Submitted</Alert.Title>
            <Alert.Description>You have successfully submitted {form.name}.</Alert.Description>
          </Alert.Root>

          <Button on:click={() => (submitted = false)} class="w-full" variant="outline">Submit another form</Button>
        </div>
      </div>
    {:else}
      <form
        method="POST"
        use:enhance
        class="h-full rounded-md p-6 pt-20 shadow-inner"
        id="createRecord"
        enctype="multipart/form-data"
      >
        <div
          class={cn("bg-background mx-auto max-w-[800px] space-y-2 overflow-hidden rounded-2xl px-10 py-6 shadow-2xl")}
          data-form-id={form.id}
        >
          <h2 class="text-4xl font-extrabold tracking-tight">
            {form.name}
          </h2>

          {#if form.description}
            <div class="my-2">
              <div>Description</div>
              <p class="text-sm">{form.description}</p>
            </div>
          {/if}

          <div class="space-y-4" use:autoAnimate>
            {#each fields as field}
              {@const shouldShow = !form || form.getShouldShowField(field.id.value, $table.schema, tempRecord)}
              {#if shouldShow}
                <Form.Field form={f} name={field.id.value}>
                  <Form.Control let:attrs>
                    <Form.Label class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2" data-field-id={field.id.value}>
                        <FieldIcon {field} type={field.type} class="h-4 w-4" />
                        <span>{field.name.value}</span>
                        {#if field.required}
                          <span class="text-red-500">*</span>
                        {/if}
                      </div>
                    </Form.Label>
                    <FieldControl
                      {...attrs}
                      bind:value={$formData[field.id.value]}
                      {field}
                      disabled={field.isSystem}
                      tableId={$table.id.value}
                    />
                  </Form.Control>
                  <Form.FieldErrors />
                </Form.Field>
              {/if}
            {/each}

            <div class="flex justify-end">
              <Button type="submit" {disabled} form="createRecord">Submit</Button>
            </div>
          </div>
        </div>
      </form>
    {/if}
  {/if}
</main>

<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import { parse, type ImportDataExtensions, type SheetData } from "$lib/import/import.helper"
  import { FileIcon, XIcon } from "lucide-svelte"
  import * as Table from "$lib/components/ui/table"
  import { invalidate, goto } from "$app/navigation"
  import { baseId, currentBase } from "$lib/store/base.store"
  import { closeModal, CREATE_TABLE_MODAL, IMPORT_TABLE_MODAL } from "$lib/store/modal.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import {
    castFieldValue,
    FieldIdVo,
    inferCreateFieldType,
    TableIdVo,
    type ICreateRecordDTO,
    type ICreateSchemaDTO,
  } from "@undb/table"
  import unzip from "lodash.unzip"

  const createRecords = createMutation({
    mutationKey: ["table", "import", "records"],
    mutationFn: trpc.record.bulkCreate.mutate,
    async onSuccess() {
      await invalidate(`table:${tableId}`)
      closeModal(IMPORT_TABLE_MODAL)
      baseId.set(null)
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  const createTable = createMutation({
    mutationKey: ["table", "import"],
    mutationFn: trpc.table.create.mutate,
    async onSuccess(data) {
      if (importData && rs.length) {
        debugger
        const records = rs.map((r, i) => {
          const record: ICreateRecordDTO = { values: {} }

          for (let j = 0; j < r.length; j++) {
            const field = schema[j]
            const type = field.type
            const value = castFieldValue(type, r[j])
            record.values[field.id!] = value
          }

          return record
        })

        $createRecords.mutate({
          tableId: data,
          records,
        })
      } else {
        await invalidate("undb:tables")
        await goto(`/t/${data}`)
        closeModal(IMPORT_TABLE_MODAL)
        baseId.set(null)
      }
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  let file: File | undefined
  let data: { name: string; extension: ImportDataExtensions; data: SheetData } | undefined
  let tableId: string | undefined
  async function onChange(e: Event) {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (!files?.length) return

    const [f] = files
    tableId = TableIdVo.create().value
    file = f
    data = await parse(file)
  }

  function removeFile() {
    file = undefined
  }

  function handleClickImport() {
    if (step === 0) {
      step = 1
      return
    }

    if (step === 1) {
      if (!file || !data) return
      const baseId = $currentBase?.id
      if (!baseId) return

      $createTable.mutate({
        id: tableId,
        name: file.name,
        baseId,
        schema,
      })

      return
    }
  }

  function removeField(index: number) {
    if (headers.length <= 1) return

    headers = headers.filter((_, i) => i !== index)
  }

  let inferFieldTypeCount = 200

  $: transposed = firstRowAsHeader
    ? unzip(data?.data.slice(1)).slice(0, inferFieldTypeCount)
    : unzip(data?.data).slice(0, inferFieldTypeCount)

  let step = 0
  let firstRowAsHeader = true
  let importData = true
  let headers: string[] = []
  let rs: string[][] = []

  $: schema = headers.map((header, i) => ({
    ...inferCreateFieldType(transposed[i]),
    name: header,
    id: FieldIdVo.create().value,
    display: i === 0,
  })) as ICreateSchemaDTO

  $: if (data) {
    if (firstRowAsHeader) {
      headers = data.data[0].map(String)
    } else {
      headers = Array.from({ length: data.data[0].length }, (_, i) => `field ${i + 1}`)
    }

    rs = firstRowAsHeader ? data.data.slice(1).map((s) => s.map(String)) : data.data.map((s) => s.map(String))
  }
</script>

{#if step === 0}
  <Input disabled={!!file} type="file" placeholder="import csv file..." on:change={onChange} />
  {#if file}
    <div class="flex items-center justify-between gap-2 rounded-sm border p-3">
      <div class="flex items-center gap-2">
        <FileIcon class="text-muted-foreground h-4 w-4" />
        <p>
          {file.name}
        </p>
      </div>

      <button class="rounded-full p-1 transition-colors hover:bg-gray-100" on:click={removeFile}>
        <XIcon class="text-muted-foreground h-4 w-4" />
      </button>
    </div>
  {/if}
  <Label class="flex items-center gap-2">
    <Checkbox bind:checked={firstRowAsHeader} />
    First row as header
  </Label>
  <Label class="flex items-center gap-2">
    <Checkbox bind:checked={importData} />
    Import Data
  </Label>
{:else if step === 1}
  {#if data && file}
    <div class="rounded-sm border">
      <div class="border-b p-3">
        {file.name}
      </div>
      <div>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head class="w-[200px]">Field Name</Table.Head>
              <Table.Head class="flex-1">Field Type</Table.Head>
              <Table.Head class="text-right">Action</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each headers as header, idx}
              <Table.Row class="group">
                <Table.Cell class="font-medium">{header}</Table.Cell>
                <Table.Cell>string</Table.Cell>
                <Table.Cell class="text-right">
                  {#if headers.length > 1}
                    <button
                      on:click={() => removeField(idx)}
                      class="rounded-full p-1 opacity-0 transition-colors hover:bg-gray-200 group-hover:opacity-100"
                    >
                      <XIcon class="text-muted-foreground h-4 w-4" />
                    </button>
                  {/if}
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  {/if}
{/if}

<div class="flex justify-end">
  <Button disabled={(step === 0 && !file) || (step === 1 && headers.length < 1)} on:click={handleClickImport} size="sm">
    import
  </Button>
</div>

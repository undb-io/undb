<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import { parse, type ImportDataExtensions, type SheetData } from "$lib/import/import.helper"
  import { FileIcon, XIcon, ArrowRightIcon, ArrowLeftIcon, LoaderCircleIcon } from "lucide-svelte"
  import * as Table from "$lib/components/ui/table"
  import { invalidate, goto } from "$app/navigation"
  import { baseId, currentBase } from "$lib/store/base.store"
  import { closeModal, IMPORT_TABLE_MODAL } from "$lib/store/modal.store"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import {
    castFieldValue,
    FieldIdVo,
    inferCreateFieldType,
    systemFieldNames,
    TableIdVo,
    type ICreateRecordDTO,
    type ICreateSchemaDTO,
  } from "@undb/table"
  import unzip from "lodash.unzip"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import { getNextName } from "@undb/utils"
  import FieldTypePicker from "../field-picker/field-type-picker.svelte"

  export let tableNames: string[]

  let file: File | undefined
  let data: { name: string; extension: ImportDataExtensions; data: SheetData } | undefined
  let tableId: string | undefined
  let inferFieldTypeCount = 200
  let step = 0
  let firstRowAsHeader = true
  let importData = true
  let tableName: string | undefined = undefined
  let schema: ICreateSchemaDTO | undefined

  const createRecords = createMutation({
    mutationKey: ["table", "import", "records"],
    mutationFn: trpc.record.bulkCreate.mutate,
    async onSuccess() {
      await invalidate("undb:tables")
      await goto(`/t/${tableId}`)
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
    async onSuccess(tableId) {
      const rs = data?.data.slice(1).map((r) => r.map((v) => String(v))) ?? []
      if (importData && rs.length) {
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
          tableId: tableId,
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

  async function setData() {
    if (!file) return

    const parsed = await parse(file)
    if (firstRowAsHeader) {
      const names = parsed.data[0].reduce((acc, cur) => {
        if (!cur) {
          return acc
        }
        const name = getNextName(acc.concat(systemFieldNames), String(cur))
        return [...acc, name]
      }, [] as string[])
      data = {
        name: file.name,
        extension: parsed.extension,
        data: [names, ...parsed.data.slice(1)],
      }
    } else {
      data = {
        name: file.name,
        extension: parsed.extension,
        data: [parsed.data[0].map((_, i) => `field ${i + 1}`), ...parsed.data],
      }
    }

    const transposed = unzip(data?.data.slice(1)).slice(0, inferFieldTypeCount)

    schema = (data?.data[0].map((header, i) => ({
      ...inferCreateFieldType(transposed[i]),
      name: header,
      id: FieldIdVo.create().value,
      display: i === 0,
    })) ?? []) as ICreateSchemaDTO
  }

  async function onChange(e: Event) {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (!files?.length) return

    const [f] = files
    tableId = TableIdVo.create().value
    file = f
    tableName = getNextName(tableNames, file.name)

    await setData()
  }

  function removeFile() {
    file = undefined
  }

  function handleClickImport() {
    if (!schema) return

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
        name: tableName!,
        baseId,
        schema,
      })

      return
    }
  }

  function removeField(index: number) {
    if (data) {
      data.data = data.data.map((r) => r.filter((_, i) => i !== index))
    }
  }
</script>

{#if step === 0}
  <Input
    disabled={!!file}
    type="file"
    placeholder="import file..."
    on:change={onChange}
    accept=".csv, .json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
  />
  {#if file}
    <div class="flex items-center justify-between gap-2 rounded-sm border p-3">
      <div class="flex items-center gap-2">
        <FileIcon class="text-muted-foreground h-4 w-4" />
        <p>
          {tableName}
        </p>
      </div>

      <button class="rounded-full p-1 transition-colors hover:bg-gray-100" on:click={removeFile}>
        <XIcon class="text-muted-foreground h-4 w-4" />
      </button>
    </div>
  {/if}
  <Label class="flex items-center gap-2">
    <Checkbox
      disabled={$createTable.isPending || $createRecords.isPending}
      bind:checked={firstRowAsHeader}
      onCheckedChange={setData}
    />
    First row as header
  </Label>
  <Label class="flex items-center gap-2">
    <Checkbox disabled={$createTable.isPending || $createRecords.isPending} bind:checked={importData} />
    Import Data
  </Label>
{:else if step === 1}
  <Label class="flex items-center gap-2">
    <Checkbox
      disabled={$createTable.isPending || $createRecords.isPending}
      bind:checked={firstRowAsHeader}
      onCheckedChange={setData}
    />
    First row as header
  </Label>
  <Label class="flex items-center gap-2">
    <Checkbox disabled={$createTable.isPending || $createRecords.isPending} bind:checked={importData} />
    Import Data
  </Label>
  {#if data && file && schema}
    <div class="p-3">
      <Label class="flex items-center gap-2">
        <div>Name</div>
        <Input disabled={$createTable.isPending || $createRecords.isPending} class="text-sm" bind:value={tableName} />
      </Label>
    </div>
    <div class="rounded-sm border">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head class="w-[200px]">Field Name</Table.Head>
            <Table.Head class="flex-1">Field Type</Table.Head>
            <Table.Head class="text-right">Action</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each schema as field, idx}
            <Table.Row class="group">
              <Table.Cell class="font-medium">
                <Input
                  class="text-sm"
                  bind:value={data.data[0][idx]}
                  disabled={$createTable.isPending || $createRecords.isPending}
                />
              </Table.Cell>
              <Table.Cell>
                <FieldTypePicker
                  disabled={$createTable.isPending || $createRecords.isPending}
                  bind:value={schema[idx].type}
                  onValueChange={() => {}}
                  tabIndex={-1}
                />
                <!-- <div class="flex items-center">
                  <FieldIcon type={field.type} class="mr-2 h-4 w-4" />
                  {field.type}
                </div> -->
              </Table.Cell>
              <Table.Cell class="text-right">
                <button
                  disabled={$createTable.isPending || $createRecords.isPending}
                  on:click={() => removeField(idx)}
                  class="rounded-full p-1 opacity-0 transition-colors hover:bg-gray-200 group-hover:opacity-100"
                >
                  <XIcon class="text-muted-foreground h-4 w-4" />
                </button>
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </div>
  {/if}
{/if}

<div class="flex justify-end gap-2">
  {#if step === 1}
    <Button
      disabled={$createTable.isPending || $createRecords.isPending}
      variant="outline"
      on:click={() => (step = 0)}
      size="sm"
    >
      <ArrowLeftIcon class="mr-2 h-4 w-4" />
      Back
    </Button>
  {/if}
  <Button
    disabled={(step === 0 && !file) ||
      (step === 1 && schema.length < 1) ||
      $createTable.isPending ||
      $createRecords.isPending}
    on:click={handleClickImport}
    size="sm"
  >
    {#if step === 0}
      Next step <ArrowRightIcon class="ml-2 h-4 w-4" />
    {:else}
      {#if $createTable.isPending || $createRecords.isPending}
        <LoaderCircleIcon class="mr-2 h-4 w-4 animate-spin" />
      {/if}
      Import
    {/if}
  </Button>
</div>

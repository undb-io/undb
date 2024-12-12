<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import { parse, type ImportDataExtensions, type SheetData } from "$lib/import/import.helper"
  import {
    FileIcon,
    XIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    LoaderCircleIcon,
    SettingsIcon,
    ImportIcon,
  } from "lucide-svelte"
  import * as Table from "$lib/components/ui/table"
  import { invalidate, goto, invalidateAll } from "$app/navigation"
  import { baseId, currentBaseId } from "$lib/store/base.store"
  import { closeModal, IMPORT_TABLE_MODAL } from "$lib/store/modal.store"
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
  import { getNextName } from "@undb/utils"
  import FieldTypePicker from "../field-picker/field-type-picker.svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import FieldOptions from "../field-options/field-options.svelte"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"
  import { type ICreateRecordsCommand, type ICreateTableCommand } from "@undb/commands"
  import { tick } from "svelte"

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
  let selectedFields: string[] = []

  const dataService = getDataService()

  const createRecords = createMutation({
    mutationKey: ["table", "import", "records"],
    mutationFn: dataService.records.createRecords,
    async onSuccess() {
      if (isPlayground) {
        await goto(`/playground/bases/${$currentBaseId}/t/${tableId}`)
        await invalidateAll()
      } else {
        await invalidate("undb:tables")
        await invalidate(`undb:table:${tableId}`)
        await goto(`/t/${tableId}`)
      }
      closeModal(IMPORT_TABLE_MODAL)
      baseId.set(null)
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  const createTable = createMutation({
    mutationKey: ["table", "import"],
    mutationFn: dataService.table.createTable,
    async onSuccess(tableId) {
      const rs = data?.data.slice(1).map((r) => r.map((v) => String(v))) ?? []
      if (importData && rs.length && schema) {
        const records = rs.map((r, i) => {
          const record: ICreateRecordDTO = { values: {} }

          for (let j = 0; j < r.length; j++) {
            const field = schema?.[j]
            if (!field || !field.id) {
              continue
            }

            if (!selectedFields.includes(field.id)) {
              continue
            }

            const value = castFieldValue(field, r[j])
            record.values[field.id!] = value
          }

          return record
        })

        // TODO: web worker
        await tick()

        $createRecords.mutate({
          tableId: tableId,
          records,
        })
      } else {
        await invalidate("undb:tables")
        await goto(`/t/${tableId}`)
        closeModal(IMPORT_TABLE_MODAL)
        baseId.set(null)
      }
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  async function handleFile() {
    if (!file) {
      data = undefined
      schema = undefined
      selectedFields = []
      return
    }

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

    handleSchemaChange()
    selectedFields = (schema?.map((field) => field.id).filter((id) => !!id) as string[]) ?? []
    step = 1
  }

  function handleSchemaChange() {
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

    await handleFile()
  }

  function removeFile() {
    file = undefined
    handleFile()
  }

  $: filteredSchema = (schema?.filter((field) => !!field.id && selectedFields.includes(field.id)) ??
    []) as ICreateSchemaDTO

  function handleClickImport() {
    if (!schema) return

    if (step === 0) {
      step = 1
      return
    }

    if (step === 1) {
      if (!file || !data) return
      const _baseId = $currentBaseId ?? $baseId
      if (!_baseId) return

      $createTable.mutate({
        id: tableId,
        name: tableName!,
        baseId: _baseId,
        schema: filteredSchema,
      })

      return
    }
  }
</script>

{#if step === 0}
  <Input
    disabled={!!file}
    type="file"
    placeholder={$LL.table.import.importFile()}
    on:change={onChange}
    accept=".csv, .json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
  />
  {#if file}
    <div class="flex items-center justify-between gap-2 rounded-sm border p-3">
      <div class="flex items-center gap-2 text-gray-600">
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
      onCheckedChange={handleFile}
    />
    {$LL.table.import.firstRowAsHeader()}
  </Label>
  <Label class="flex items-center gap-2">
    <Checkbox disabled={$createTable.isPending || $createRecords.isPending} bind:checked={importData} />
    {$LL.table.import.importData()}
  </Label>
{:else if step === 1}
  <Label class="flex items-center gap-2">
    <Checkbox
      disabled={$createTable.isPending || $createRecords.isPending}
      bind:checked={firstRowAsHeader}
      onCheckedChange={handleFile}
    />
    {$LL.table.import.firstRowAsHeader()}
  </Label>
  <Label class="flex items-center gap-2">
    <Checkbox disabled={$createTable.isPending || $createRecords.isPending} bind:checked={importData} />
    <span>{$LL.table.import.importData()}</span>

    {#if (data?.data.length ?? 0) > 1}
      <span>({(data?.data.length ?? 0) - 1} rows)</span>
    {/if}
  </Label>
  {#if data && file && schema}
    <div class="space-y-2">
      <Label class="flex items-center gap-2">
        <div>Name</div>
        <Input disabled={$createTable.isPending || $createRecords.isPending} class="text-sm" bind:value={tableName} />
      </Label>

      <p class="text-sm text-gray-500">
        {$LL.table.import.fieldsSelected({ count: selectedFields.length })}
      </p>
    </div>
    <div class="rounded-sm border">
      <Table.Root class="flex h-[400px] flex-col overflow-hidden">
        <Table.Header class="flex w-full">
          <Table.Row class="w-full">
            <Table.Head class="w-[40px]"></Table.Head>
            <Table.Head class="w-[200px]">Field Name</Table.Head>
            <Table.Head class="flex-1">Field Type</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body class="w-full flex-1 overflow-y-auto">
          {#each schema as field, idx}
            <Table.Row data-field-id={field.id} class="group flex w-full">
              <Table.Cell class="flex w-[40px] items-center justify-center font-medium">
                {#if !!field.id}
                  <Checkbox
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => {
                      if (selectedFields.includes(field.id)) {
                        selectedFields = selectedFields.filter((id) => id !== field.id)
                      } else {
                        selectedFields = [...selectedFields, field.name]
                      }
                    }}
                    disabled={$createTable.isPending || $createRecords.isPending}
                  />
                {/if}
              </Table.Cell>
              <Table.Cell class="w-[200px] font-medium">
                <Input
                  class="text-sm"
                  bind:value={data.data[0][idx]}
                  disabled={$createTable.isPending || $createRecords.isPending}
                />
              </Table.Cell>
              <Table.Cell class="flex flex-1 items-center gap-2">
                <FieldTypePicker
                  disabled={$createTable.isPending || $createRecords.isPending}
                  filter={(type) => type !== "reference" && type !== "rollup"}
                  bind:value={schema[idx].type}
                  onValueChange={() => {}}
                  tabIndex={-1}
                />
                <Dialog.Root>
                  <Dialog.Trigger>
                    <SettingsIcon class="text-muted-foreground size-4" />
                  </Dialog.Trigger>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title class="flex items-center">
                        {$LL.table.import.configField()}
                        <FieldIcon type={field.type} class="ml-2 mr-2 size-4" />
                        {field.name}
                      </Dialog.Title>

                      <FieldOptions
                        type={field.type}
                        bind:option={field.option}
                        bind:constraint={field.constraint}
                        bind:display={field.display}
                        bind:defaultValue={field.defaultValue}
                      />
                    </Dialog.Header>
                  </Dialog.Content>
                </Dialog.Root>
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
      {$LL.common.back()}
    </Button>
  {/if}
  <Button
    disabled={(step === 0 && !file) ||
      (step === 1 && (!schema || schema.length < 1)) ||
      $createTable.isPending ||
      $createRecords.isPending ||
      selectedFields.length < 1}
    on:click={handleClickImport}
    class="min-w-32"
    size="sm"
  >
    {#if step === 0}
      {$LL.table.import.nextStep()} <ArrowRightIcon class="ml-2 h-4 w-4" />
    {:else}
      {#if $createTable.isPending || $createRecords.isPending}
        <LoaderCircleIcon class="mr-2 h-4 w-4 animate-spin" />
      {/if}
      <ImportIcon class="mr-2 size-4" />
      {$LL.common.import()}
    {/if}
  </Button>
</div>

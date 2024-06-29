<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import { parse, type ImportDataExtensions, type SheetData } from "$lib/import/import.helper"
  import { FileIcon, XIcon } from "lucide-svelte"
  import * as Table from "$lib/components/ui/table"

  let file: File | undefined
  let data: { name: string; extension: ImportDataExtensions; data: SheetData } | undefined
  async function onChange(e: Event) {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (!files?.length) return

    const [f] = files
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
      return
    }
  }

  function removeField(index: number) {
    if (headers.length <= 1) return

    headers = headers.filter((_, i) => i !== index)
  }

  let step = 0
  let firstRowAsHeader = true
  let importData = true
  let headers: string[] = []

  $: if (data) {
    if (firstRowAsHeader) {
      headers = data.data[0].map(String)
    } else {
      headers = Array.from({ length: data.data[0].length }, (_, i) => `field ${i + 1}`)
    }
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

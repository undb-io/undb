<script lang="ts">
	import { cn } from '$lib/utils'
	import RecordCard from '$lib/record/RecordCard.svelte'
	import type { Records, Record, ReferenceFieldTypes, Table } from '@undb/core'
	import * as Alert from '$lib/components/ui/alert'
	import { Button } from '$lib/components/ui/button'
	import VirtualList from 'svelte-tiny-virtual-list'
	import { tableById } from '$lib/store/table'
	import { writable } from 'svelte/store'
	import { t } from '$lib/i18n'
	import { isString } from 'lodash-es'
	import { Input } from '$components/ui/input'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Label } from '$components/ui/label'

	let loading = false
	let initialLoading = false
	let open = false

	export let readonly = false

	export let foreignTableId: string
	export let value: string[] = []
	export let field: ReferenceFieldTypes
	export let getForeignRecords: (q?: string) => Promise<Records>
	export let getInitRecords: () => Promise<Records>

	let records = writable<Records>([])
	let initialRecords: Records = []
	const recordsMap = writable(new Map<string, Record>())

	const change = (e: Event, recordId: string) => {
		const target = e.target as HTMLInputElement
		if (target.checked) {
			add(recordId)
		} else {
			remove(recordId)
		}
	}

	let loaded = false
	async function getInitial() {
		if (!open && !loaded && value?.length) {
			initialLoading = true
			initialRecords = await getInitRecords()
			initialLoading = false
			loaded = true
		}
	}

	$: value, getInitial()

	let foreignTable: Table | undefined
	$: if (foreignTableId) {
		$tableById(foreignTableId).then((t) => (foreignTable = t))
	}
	$: schema = foreignTable?.schema

	$: {
		for (const record of initialRecords) {
			recordsMap.set($recordsMap.set(record.id.value, record))
		}
		for (const record of $records) {
			recordsMap.set($recordsMap.set(record.id.value, record))
		}
	}

	async function getForeign() {
		loading = true
		records.set(await getForeignRecords())
		loading = false
	}

	function remove(recordId: string) {
		value = value?.filter((r) => r !== recordId) ?? []
	}

	function add(recordId: string) {
		value = [...(value ?? []), recordId]
	}

	$: if (open) getForeign()
	$: selected = Array.isArray(value) ? value?.map((r) => $recordsMap.get(r)!).filter(Boolean) ?? [] : []
	$: selectedIds = selected.map((s) => s.id.value)

	let form: HTMLFormElement

	const onSubmit = async (e: Event) => {
		e.preventDefault()
		const formData = new FormData(form)
		const query = formData.get('search')
		if (isString(query) && !!query) {
			records.set(await getForeignRecords(query))
		}
	}
</script>

{#if schema}
	<div class="space-y-2 max-h-96 overflow-y-auto mb-2">
		<div class="space-y-2 h-full overflow-auto">
			{#each selected as record}
				{#if !!record}
					<div class="group relative">
						<RecordCard
							{field}
							{record}
							{schema}
							class="w-full shadow-none hover:shadow-md transition hover:border-primary-400 !max-w-none"
							role="button"
						/>
						{#if !readonly}
							<button
								on:click={() => remove(record.id.value)}
								class="absolute z-50 right-2 top-[50%] text-sm translate-y-[-50%] translate-x-[-50%] opacity-0 group-hover:opacity-100 transition text-gray-400"
							>
								<i class="ti ti-x text-lg"></i>
							</button>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	</div>

	{#if !readonly}
		<Button
			variant="outline"
			type="button"
			on:click={() => (open = true)}
			{...$$restProps}
			class={cn('space-x-2', $$restProps.class)}
		>
			{#if initialLoading}
				<i class="ti ti-rotate animate-spin"></i>
			{:else}
				<i class="ti ti-link" />
				<span>{$t('Select Record')}</span>
			{/if}
		</Button>

		<Dialog.Root bind:open>
			<Dialog.Content class="h-3/4 block space-y-2 bg-white dark:bg-gray-800">
				<Dialog.Header class="mb-5">
					<Dialog.Title>{$t('Select Record') ?? undefined}</Dialog.Title>
				</Dialog.Header>

				{#if loading}
					<div class="flex w-full h-full items-center justify-center">
						<i class="ti ti-rotate animate-spin"></i>
					</div>
				{:else if !$records.length}
					<Alert.Root>
						<Alert.Title>
							{$t('no record available')}
						</Alert.Title>
					</Alert.Root>
				{:else}
					<form bind:this={form} on:submit={onSubmit}>
						<div class="flex items-center gap-2">
							<Input name="search" placeholder={$t('Search Foreign Records')}></Input>
							<Button type="submit" size="sm" class="!p-2.5 hidden lg:block">
								<svg
									class="w-3 h-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</Button>
						</div>
					</form>
					<VirtualList height={600} width="100%" itemCount={$records.length} itemSize={50}>
						<div slot="item" let:index let:style {style} class="flex items-stretch">
							{@const isSelected = selectedIds.includes($records[index].id.value)}
							<Label class="w-full">
								<input
									type="checkbox"
									class="hidden"
									value={$records[index].id.value}
									on:change={(e) => {
										change(e, $records[index].id.value)
									}}
								/>
								<RecordCard
									{field}
									{schema}
									record={$records[index]}
									class={cn(
										'w-full shadow-none hover:shadow-md transition hover:border-primary !max-w-none',
										isSelected && 'border-primary',
									)}
								/>
							</Label>
						</div>
					</VirtualList>
				{/if}
			</Dialog.Content>
		</Dialog.Root>
	{/if}
{/if}

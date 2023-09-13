<script lang="ts">
	import type { IFilter, IQueryFieldSchema } from '@undb/core'
	import Sortable, { type SortableEvent } from 'sortablejs'
	import { identity, isNumber } from 'lodash-es'
	import FilterItem from '$lib/table/FilterItem.svelte'

	export let value: Partial<IFilter>[] = []
	export let readonly = false
	export let fieldFilter: (field: IQueryFieldSchema) => boolean = identity
	export let createInitial = true

	$: if (!value) value = []

	$: if (!value?.length && !readonly && createInitial) {
		add()
	}

	const TEMP_ID = '__TEMP_ID'

	const add = () => {
		if (value.some((v) => v.path === TEMP_ID)) return
		value = [...value, { path: TEMP_ID }]
	}

	const remove = (index: number) => {
		value = value.filter((f, i) => i !== index)
	}

	const onEnd = (event: SortableEvent) => {
		const { oldIndex, newIndex } = event
		if (isNumber(oldIndex) && isNumber(newIndex)) {
			;[value[oldIndex], value[newIndex]] = [value[newIndex], value[oldIndex]]
		}
	}

	let el: HTMLUListElement
	$: if (el) {
		Sortable.create(el, {
			animation: 200,
			direction: 'vertical',
			onEnd,
			handle: '.handle',
		})
	}
</script>

{#if value?.length}
	<ul class="space-y-2" bind:this={el}>
		{#each value as filter, index (String(filter.path) + filter.operator + String(filter.value))}
			<FilterItem {filter} {index} {remove} {readonly} {fieldFilter} />
		{/each}
	</ul>
{:else}
	<slot name="empty" />
{/if}
{#if !readonly}
	<slot {add} />
{/if}

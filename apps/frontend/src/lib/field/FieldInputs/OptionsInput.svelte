<script lang="ts">
	import OptionColorPicker from '$lib/option/OptionColorPicker.svelte'
	import { OptionColor, type IMutateOptionSchema, OptionKey } from '@undb/core'
	import { Button } from '$lib/components/ui/button'
	import { onMount } from 'svelte'
	import type { SetRequired } from 'type-fest'
	import { t } from '$lib/i18n'
	import { Input } from '$components/ui/input'
	import Sortable, { type SortableEvent } from 'sortablejs'
	import { isNumber } from 'lodash-es'

	export let value: SetRequired<IMutateOptionSchema, 'color'>[] = []

	onMount(() => {
		if (!value) value = []
		if (!value?.length) {
			addOption()
		}
	})

	function addOption() {
		const color =
			value.length === 0
				? OptionColor.defaultColor.toJSON()
				: OptionColor.create(value[value.length - 1]?.color)
						.next()
						.toJSON()
		value = [...value, { key: OptionKey.createId(), name: '', color }]
	}

	function removeOption(index: number) {
		value = value.filter((_, i) => i !== index)
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

<ul class="space-y-2" bind:this={el}>
	{#each value ?? [] as option, index (option.key)}
		<li class="flex items-center">
			<button type="button" class="handle mr-2">
				<i class="ti ti-grip-vertical"></i>
			</button>
			<OptionColorPicker class="rounded-r-none rounded-l-md" bind:value={option.color.name} name={option.name} />
			<Input class="!rounded-l-none !focus:rounded-none border-gray-100 h-[30px]" bind:value={option.name} />
			<Button
				class="w-[30px] aspect-square !rounded-l-none !p-0 border-l-0 border-gray-200"
				variant="ghost"
				size="sm"
				on:click={() => removeOption(index)}
			>
				<i class="ti ti-trash text-sm" />
			</Button>
		</li>
	{/each}
</ul>
<Button variant="secondary" size="sm" on:click={addOption}>{$t('Create New Option')}</Button>

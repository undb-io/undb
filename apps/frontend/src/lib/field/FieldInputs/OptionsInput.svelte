<script lang="ts">
	import OptionColorPicker from '$lib/option/OptionColorPicker.svelte'
	import { OptionColor, type IMutateOptionSchema } from '@undb/core'
	import { Button, Input } from 'flowbite-svelte'
	import { onMount } from 'svelte'
	import type { SetRequired } from 'type-fest'
	import { t } from '$lib/i18n'

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
		value = [...value, { name: '', color }]
	}

	function removeOption(index: number) {
		value = value.filter((_, i) => i !== index)
	}
</script>

<div class="space-y-2">
	{#each value ?? [] as option, index}
		<div class="flex">
			<OptionColorPicker class="rounded-r-none rounded-l-md" bind:value={option.color.name} name={option.name} />
			<Input class="!rounded-none !focus:rounded-none border-gray-100 h-[30px]" bind:value={option.name} />
			<Button
				color="light"
				class="w-[30px] aspect-square !rounded-l-none !p-0 border-l-0 border-gray-200"
				size="xs"
				on:click={() => removeOption(index)}
			>
				<i class="ti ti-trash text-sm" />
			</Button>
		</div>
	{/each}
</div>
<Button color="alternative" size="xs" on:click={addOption}>{$t('Create New Option')}</Button>

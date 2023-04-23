<script lang="ts">
	import OptionColorPicker from '$lib/option/OptionColorPicker.svelte'
	import { OptionColor, type IMutateOptionSchema } from '@undb/core'
	import { Button, Input } from 'flowbite-svelte'
	import { onMount } from 'svelte'
	import type { SetRequired } from 'type-fest'
	import autoAnimate from '@formkit/auto-animate'
	import { IconTrash } from '@tabler/icons-svelte'

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
				? OptionColor.defaultColor.unpack()
				: OptionColor.create(value[value.length - 1]?.color)
						.next()
						.unpack()
		value = [...value, { name: '', color }]
	}

	function removeOption(index: number) {
		value = value.filter((_, i) => i !== index)
	}
</script>

<div class="space-y-2" use:autoAnimate={{ duration: 100 }}>
	{#each value ?? [] as option, index}
		<div class="flex">
			<OptionColorPicker class="rounded-r-none rounded-l-md" bind:value={option.color.name} />
			<Input class="!rounded-none !focus:rounded-none border-gray-100 h-[28px]" bind:value={option.name} />
			<Button
				color="light"
				class="w-[28px] aspect-square !rounded-l-none !rounded-r-sm !p-0 border-l-0 border-gray-200"
				size="xs"
				on:click={() => removeOption(index)}
			>
				<IconTrash color="gray" size={14} />
			</Button>
		</div>
	{/each}
</div>
<Button color="alternative" size="xs" on:click={addOption}>Add New Option</Button>

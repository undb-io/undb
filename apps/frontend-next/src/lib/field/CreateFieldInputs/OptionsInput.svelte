<script lang="ts">
	import OptionColorPicker from '$lib/option/OptionColorPicker.svelte'
	import { OptionColor, type IMutateOptionSchema } from '@undb/core'
	import { Button, Input } from 'flowbite-svelte'
	import { onMount } from 'svelte'
	import type { SetRequired } from 'type-fest'
	import autoAnimate from '@formkit/auto-animate'

	export let value: SetRequired<IMutateOptionSchema, 'color'>[] = []

	onMount(() => {
		if (!value) value = []
		if (!value?.length) {
			addOption()
		}
	})

	function addOption() {
		value = [...value, { name: '', color: { name: OptionColor.defaultColorName, shade: OptionColor.defaultShade } }]
	}
</script>

<div class="space-y-2" use:autoAnimate={{ duration: 100 }}>
	{#each value ?? [] as option}
		<div class="flex">
			<OptionColorPicker class="rounded-r-none rounded-l-md" bind:value={option.color.name} />
			<Input class="rounded-l-none border-l-0 h-[28px]" bind:value={option.name} />
		</div>
	{/each}
</div>
<Button color="alternative" size="xs" on:click={addOption}>Add New Option</Button>

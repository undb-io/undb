<script lang="ts">
	import cx from 'classnames'
	import { Button, Checkbox, Dropdown } from 'flowbite-svelte'
	import Portal from 'svelte-portal'

	let open = false

	export let value: string[] = []
	$: {
		if (!value) value = []
	}

	const types = [
		{ value: '.pdf', label: '.pdf' },
		{ value: '.png', label: '.png' },
		{ value: '.docx', label: '.docx' },
		{ value: '.xlsx', label: '.xlsx' },
		{ value: '.pptx', label: '.pptx' },
		{ value: '.txt', label: '.txt' },
	] as const

	$: selected = types.filter((t) => value.includes(t.value))
</script>

<Button
	color="alternative"
	{...$$restProps}
	class={cx($$restProps.class, 'gap-2 extension_picker')}
	on:click={() => (open = true)}
>
	{#each selected as item}
		<span class="whitespace-nowrap text-xs">
			{item.label}
		</span>
		<!-- content here -->
	{/each}
</Button>
<Portal target="body">
	<Dropdown style="z-index: 50;" triggeredBy=".extension_picker" class="z-[99999] w-48" bind:open>
		{#each types as type (type.value)}
			{@const selected = value.includes(type.value)}
			<Checkbox value={type.value} bind:group={value} custom on:change={() => (open = false)}>
				<div
					role="listitem"
					class="w-full pr-4 flex justify-between hover:bg-gray-100 transition cursor-pointer"
					class:bg-gray-100={selected}
				>
					<span class="text-xs">
						{type.label}
					</span>
					<span>
						{#if selected}
							<i class="ti ti-check text-sm" />
						{/if}
					</span>
				</div>
			</Checkbox>
		{/each}
	</Dropdown>
</Portal>

<script lang="ts">
	import cx from 'classnames'
	import { Button, Dropdown, Radio } from 'flowbite-svelte'
	import Portal from 'svelte-portal'
	import { t } from '$lib/i18n'

	let open = false

	export let value = 'image'

	const types = [
		{ value: 'image', label: $t('Image', { ns: 'common' }) as string, icon: 'photo' },
		{ value: 'text', label: $t('Text', { ns: 'common' }) as string, icon: 'file-text' },
		{ value: 'video', label: $t('Video', { ns: 'common' }) as string, icon: 'camera' },
		{ value: 'document', label: $t('Document', { ns: 'common' }) as string, icon: 'book' },
		{ value: 'excel', label: $t('Excel', { ns: 'common' }) as string, icon: 'file-spreadsheet' },
		{ value: 'ppt', label: $t('PPT', { ns: 'common' }) as string, icon: 'album' },
		{ value: 'pdf', label: $t('PDF', { ns: 'common' }) as string, icon: 'pdf' },
	] as const

	$: selected = types.find((t) => t.value === value)
</script>

<Button
	color="alternative"
	{...$$restProps}
	class={cx($$restProps.class, 'gap-2 attachment_type_picker')}
	on:click={() => (open = true)}
>
	<i class={`ti ti-${selected?.icon}`} />
	<span class="whitespace-nowrap text-xs">
		{selected?.label}
	</span>
</Button>
<Portal target="body">
	<Dropdown triggeredBy=".attachment_type_picker" class="z-[99999]" bind:open>
		{#each types as type (type.value)}
			<Radio value={type.value} bind:group={value} custom on:change={() => (open = false)}>
				<div
					role="listitem"
					class="w-full p-2 pr-4 flex justify-between hover:bg-gray-100 transition cursor-pointer"
					class:bg-gray-100={value === type.value}
				>
					<div class="inline-flex gap-2 items-center text-gray-600">
						<i class={`ti ti-${type.icon}`} />
						<span class="text-xs">
							{type.label}
						</span>
					</div>
					<span>
						{#if value === type.value}
							<i class="ti ti-check text-sm" />
						{/if}
					</span>
				</div>
			</Radio>
		{/each}
	</Dropdown>
</Portal>

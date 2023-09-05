<script lang="ts">
	import { t } from '$lib/i18n'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'

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

	$: selected = types.find((v) => v.value === value)
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]} class="gap-2">
			{#if selected}
				{selected.label}
			{:else}
				{$t('select filter type')}
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.RadioGroup bind:value>
			{#each types as type}
				<DropdownMenu.RadioItem value={type.value} class="gap-2">
					<i class={`ti ti-${type.icon}`}></i>
					<span>
						{type.label}
					</span>
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>

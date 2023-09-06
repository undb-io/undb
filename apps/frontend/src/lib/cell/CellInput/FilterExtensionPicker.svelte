<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'
	import { Label } from '$components/ui/label'
	import { t } from '$lib/i18n'

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
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]}>
			{#if value.length}
				{value.join(', ')}
			{:else}
				<span class="text-sm text-gray-300">
					{$t('select extension')}
				</span>
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		{#each types as type}
			{@const selected = value.includes(type.value)}
			<DropdownMenu.Item>
				<Label
					class="inline-flex items-center justify-between cursor-pointer w-full hover:bg-gray-100 dark:hover:bg-gray-400 gap-2"
				>
					<input type="checkbox" bind:group={value} value={type.value} class="hidden" />
					<span>
						{type.label}
					</span>
					{#if selected}
						<i class="ti ti-check"></i>
					{/if}
				</Label>
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>

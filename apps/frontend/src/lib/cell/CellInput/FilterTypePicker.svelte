<script lang="ts">
	import { t } from '$lib/i18n'
	import * as Select from '$lib/components/ui/select'

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
</script>

<Select.Root bind:value>
	<Select.Trigger>
		<Select.Value class="font-bold text-xs" />
	</Select.Trigger>
	<Select.Content>
		{#each types as type}
			<Select.Item value={type.value}>
				<i class={`block mr-2 ti ti-${type.icon}`}></i>
				{type.label}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>

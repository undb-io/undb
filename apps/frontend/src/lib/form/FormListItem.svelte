<script lang="ts">
	import { t } from '$lib/i18n'
	import { formListDrawer, selectedForm, selectedFormId } from '$lib/store/drawer'
	import { formEditorModal } from '$lib/store/modal'
	import type { Form } from '@undb/core'
	import { Card, P, Toggle, Tooltip } from 'flowbite-svelte'

	export let form: Form
</script>

<Card
	class="w-full !max-w-none shadow-sm cursor-pointer hover:shadow-md transition-all"
	on:click={() => {
		$selectedFormId = form.id.value
		formListDrawer.close()
		formEditorModal.open()
	}}
>
	<div class="flex items-center justify-between group">
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-3">
				<i class="ti ti-forms" />
				<P class="font-semibold text-lg">{form.name.value}</P>
			</div>
		</div>
	</div>
</Card>

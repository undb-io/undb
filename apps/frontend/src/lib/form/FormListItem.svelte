<script lang="ts">
	import { selectedFormId } from '$lib/store/drawer'
	import { formEditorModal, formListDrawer } from '$lib/store/modal'
	import type { Form } from '@undb/core'
	import { P } from 'flowbite-svelte'
	import * as Card from '$lib/components/ui/card'

	export let form: Form
</script>

<Card.Root class="w-full !max-w-none shadow-sm cursor-pointer hover:shadow-md transition-all">
	<Card.Header>
		<div
			on:click={() => {
				$selectedFormId = form.id.value
				formListDrawer.close()
				formEditorModal.open()
			}}
			class="flex items-center justify-between group"
		>
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-3">
					<i class="ti ti-forms" />
					<P class="font-semibold text-lg">{form.name.value}</P>
				</div>
			</div>
		</div>
	</Card.Header>
</Card.Root>

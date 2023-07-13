<script lang="ts">
	import { selectedForm } from '$lib/store/drawer'
	import type { Form } from '@undb/core'
	import { Card, P } from 'flowbite-svelte'

	export let form: Form
</script>

<Card
	class="w-full !max-w-none shadow-sm cursor-pointer hover:shadow-md transition-all"
	on:click={() => ($selectedForm = form)}
>
	<div class="flex items-center justify-between group">
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-3">
				<i class="ti ti-forms" />
				<P class="font-semibold text-lg">{form.name.value}</P>
			</div>
		</div>

		<!-- <div>
			<button
				class="group-hover:opacity-100 opacity-0"
				on:click={() =>
					$deleteWebhook.mutate({
						webhookId: webhook.id,
					})}
			>
				<i class="ti ti-trash" />
			</button>
		</div> -->
	</div>
</Card>

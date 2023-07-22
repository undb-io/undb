<script lang="ts">
	import { getRecord } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'

	const record = getRecord()

	$: getAudits = trpc().audit.getRecordAudits.query(
		{
			recordId: $record?.id.value ?? '',
		},
		{ enabled: !!$record },
	)

	$: audits = $getAudits.data?.audits ?? []
</script>

<section>
	{#each audits as audit}
		<div>
			{audit.id}
		</div>
	{/each}
</section>

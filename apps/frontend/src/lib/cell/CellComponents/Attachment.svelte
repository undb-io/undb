<script lang="ts">
	import type { AttachmentFieldValue } from '@undb/core'
	import AttachmentComponent from './AttachmentComponent.svelte'

	export let value: AttachmentFieldValue
	$: attachments = value.unpack()
</script>

<AttachmentComponent value={attachments} />

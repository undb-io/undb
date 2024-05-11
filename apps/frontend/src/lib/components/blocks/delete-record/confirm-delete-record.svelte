<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { confirmDeleteRecordOpen } from '$lib/store/record.store';
</script>

<AlertDialog.Root bind:open={$confirmDeleteRecordOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel on:click={() => ($confirmDeleteRecordOpen = false)}>
				Cancel
			</AlertDialog.Cancel>
			<AlertDialog.Action>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

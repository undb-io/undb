<script lang="ts">
	import type { Form } from '@undb/core'

	export let form: Form
</script>

<div>{form.name.value}</div>

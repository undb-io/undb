import { TableDo, tableCreator, type ITableDTO } from '@undb/table';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export function setTable(table: ITableDTO) {
	const t = tableCreator.fromJSON(table);
	setContext('table', writable(t));
}

export function getTable() {
	return getContext<Writable<TableDo>>('table');
}

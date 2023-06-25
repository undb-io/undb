import Papa from 'papaparse'
import { match } from 'ts-pattern'
import { read, utils } from 'xlsx'

export type SheetData = (string | number | null)[][]

const getExtension = (filename: string) => filename.split('.').pop()

const parseCsv = async (file: File): Promise<SheetData> => {
	return new Promise((resolve) => {
		Papa.parse<string[]>(file, {
			complete(results) {
				resolve(results.data)
			},
		})
	})
}

const parseExcel = async (file: File): Promise<SheetData> => {
	const wb = read(await file.arrayBuffer())
	const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 })
	return data as SheetData
}

export const parse = async (file: File): Promise<SheetData> => {
	const fileName = file.name
	const ext = getExtension(fileName)
	return match(ext)
		.with('csv', () => parseCsv(file))
		.with('xlsx', 'xls', () => parseExcel(file))
		.otherwise(() => Promise.resolve([] as SheetData))
}

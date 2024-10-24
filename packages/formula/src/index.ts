import { parseFormula } from "./util"

const input = "ADD(1, ADD(2, {{ field1 }}))"
// const input = "{{ field1 }} + 2"
const result = parseFormula(input)

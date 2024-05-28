export const getNextName = (names: string[] = [], defaultName = "field"): string => {
  const name = `${defaultName} (${names.length + 1})`
  return names.includes(name) ? getNextName(names, name) : name
}

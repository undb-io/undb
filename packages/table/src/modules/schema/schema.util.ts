export const getNextName = (names: string[] = [], defaultName = "field", level = 0): string => {
  const name = level ? `${defaultName} (${level})` : defaultName
  return names.includes(name) ? getNextName(names, name, level + 1) : name
}

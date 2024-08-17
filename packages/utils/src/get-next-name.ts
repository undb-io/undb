export const getNextName = (names: string[] = [], defaultName = "field", level = 0): string => {
  let name = ""
  if (level) {
    if (defaultName.endsWith(`(${level - 1})`)) {
      name = defaultName.replace(`(${level - 1})`, `(${level})`)
    } else {
      name = `${defaultName}(${level})`
    }
  } else {
    name = defaultName
  }
  return names.includes(name) ? getNextName(names, name, level + 1) : name
}

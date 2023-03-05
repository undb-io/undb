import { ValueObject } from './value-object.js'

export function convertPropsToObject(props: any): any {
  const propsCopy = { ...props }

  // eslint-disable-next-line guard-for-in
  for (const prop in propsCopy) {
    if (Array.isArray(propsCopy[prop])) {
      propsCopy[prop] = (propsCopy[prop] as Array<unknown>).map((item) => {
        return convertToPlainObject(item)
      })
    }
    propsCopy[prop] = convertToPlainObject(propsCopy[prop])
  }

  return propsCopy
}

function convertToPlainObject(item: any): any {
  if (ValueObject.isValueObject(item)) {
    return item.unpack()
  }
  return item
}

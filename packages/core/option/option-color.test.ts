import { OptionColor } from './option-color'

describe('create', () => {
  test('should create default option color', () => {
    const oc = OptionColor.create()
    expect(oc).to.be.instanceOf(OptionColor)
    expect(oc.name).to.be.eq('indigo')
    expect(oc.shade).to.be.eq(5)
  })

  test('should create option color with value', () => {
    const oc = OptionColor.create({ name: 'dark', shade: 0 })
    expect(oc).to.be.instanceOf(OptionColor)
    expect(oc.name).to.be.eq('dark')
    expect(oc.shade).to.be.eq(0)
  })

  test('should create option color with only name', () => {
    const oc = OptionColor.create({ name: 'dark' })
    expect(oc).to.be.instanceOf(OptionColor)
    expect(oc.name).to.be.eq('dark')
    expect(oc.shade).to.be.eq(5)
  })

  test('should create option color with only shade', () => {
    const oc = OptionColor.create({ shade: 0 })
    expect(oc).to.be.instanceOf(OptionColor)
    expect(oc.name).to.be.eq('indigo')
    expect(oc.shade).to.be.eq(0)
  })
})

describe('next', () => {
  test('should get next color', () => {
    const color = OptionColor.create()
    expect(color.next()).toMatchInlineSnapshot(`
      OptionColor {
        "props": {
          "name": "blue",
          "shade": 5,
        },
      }
    `)
  })

  test('should get next color for last color name', () => {
    const color = OptionColor.create({ name: 'orange' })
    expect(color.next().name).to.be.eq('dark')
  })
})

describe('createColors', () => {
  test('should create colors if no input', () => {
    const colors = OptionColor.createColors([undefined, undefined])
    expect(colors).to.toMatchSnapshot()
  })

  test('should create colors if has input', () => {
    const colors = OptionColor.createColors([{ name: 'blue' }, { name: 'red' }])
    expect(colors).to.toMatchSnapshot()
  })
})

import { OptionColor } from './option-color.js'

describe('create', () => {
  test('should create default option color', () => {
    const oc = OptionColor.create()
    expect(oc).to.be.instanceOf(OptionColor)
    expect(oc.name).to.be.eq('indigo')
    expect(oc.shade).to.be.eq(5)
  })

  test('should create option color with value', () => {
    const oc = OptionColor.create({ name: 'blue', shade: 0 })
    expect(oc).to.be.instanceOf(OptionColor)
    expect(oc.name).to.be.eq('blue')
    expect(oc.shade).to.be.eq(0)
  })

  test('should create option color with only name', () => {
    const oc = OptionColor.create({ name: 'blue' })
    expect(oc).to.be.instanceOf(OptionColor)
    expect(oc.name).to.be.eq('blue')
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
      {
        "name": "violet",
        "shade": 5,
      }
    `)
  })

  test('should get next color for last color name', () => {
    const color = OptionColor.create({ name: 'orange' })
    expect(color.next().name).toMatchInlineSnapshot('"amber"')
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

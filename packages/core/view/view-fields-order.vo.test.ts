import { ViewFieldsOrder } from '.'

describe('ViewFieldsOrder', () => {
  test('#move()', () => {
    const origin = new ViewFieldsOrder(['1', '2', '3'])
    const moved = origin.swap('1', '3')
    expect(moved.order).toEqual(['3', '2', '1'])
    expect(moved === origin).toBe(false)
  })
})

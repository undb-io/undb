import { ViewFieldsOrder } from './view-fields-order.vo'

describe('ViewFieldsOrder', () => {
  test('#move()', () => {
    const origin = new ViewFieldsOrder(['1', '2', '3'])
    const moved = origin.move('1', '3')
    expect(moved.order).toEqual(['2', '3', '1'])
    // expect new value object instance
    expect(moved === origin).toBe(false)
  })
})

export class Table {
  readonly id!: string
  readonly name!: string

  private constructor(name: string) {
    this.id = 'hello'
    this.name = name
  }

  static create(name: string): Table {
    return new Table(name)
  }
}

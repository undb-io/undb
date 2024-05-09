import type { ID } from './id.vo.js'

export interface BaseEntityProps<TI extends ID> {
  id: TI
  createdAt: Date
  updatedAt: Date
}

export interface CreateEntityProps<TI extends ID, T> {
  id: TI
  props: T
  createdAt?: Date
  updatedAt?: Date
}

export abstract class Entity<TI extends ID, EntityProps = any> {
  constructor({ id, createdAt, updatedAt, props }: CreateEntityProps<TI, EntityProps>) {
    this._id = id
    const now = new Date()
    this._createdAt = createdAt || now
    this._updatedAt = updatedAt || now
    this.props = props
  }

  protected readonly props: EntityProps

  protected readonly _id: TI

  private readonly _createdAt: Date

  private _updatedAt: Date

  get id(): TI {
    return this._id
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  /**
   *  Checks if two entities are the same Entity by comparing ID field.
   * @param object Entity
   */
  public equals(object?: Entity<TI, EntityProps>): boolean {
    if (object === null || object === undefined) {
      return false
    }

    if (this === object) {
      return true
    }

    return this.id ? this.id === object.id : false
  }

  /**
   * Returns current **copy** of entity's props.
   * Modifying entity's state won't change previously created
   * copy returned by this method since it doesn't return a reference.
   * If a reference to a specific property is needed create a getter in parent class.
   *
   * @return {*}  {Props & EntityProps}
   * @memberof Entity
   */
  public getPropsCopy(): EntityProps & BaseEntityProps<TI> {
    const propsCopy = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      ...this.props,
    }
    return Object.freeze(propsCopy)
  }
}

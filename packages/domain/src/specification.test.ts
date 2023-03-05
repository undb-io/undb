import type { Result } from 'oxide.ts'
import { CompositeSpecification } from './specification.js'

describe('and', () => {
  it('should return true for matched senario', () => {
    class Test1 extends CompositeSpecification {
      isSatisfiedBy(t: any): boolean {
        return 1 > 0
      }
      mutate(t: any): Result<any, string> {
        throw new Error('Method not implemented.')
      }
      accept(v: any): Result<void, string> {
        throw new Error('Method not implemented.')
      }
    }
    class Test2 extends CompositeSpecification {
      isSatisfiedBy(t: any): boolean {
        return 2 > 0
      }
      mutate(t: any): Result<any, string> {
        throw new Error('Method not implemented.')
      }
      accept(v: any): Result<void, string> {
        throw new Error('Method not implemented.')
      }
    }

    const v = new Test1().and(new Test2()).isSatisfiedBy(undefined)
    expect(v).toBe(true)
  })

  it('should return false for not matched senario', () => {
    class Test1 extends CompositeSpecification {
      isSatisfiedBy(t: any): boolean {
        return 0 > 1
      }
      mutate(t: any): Result<any, string> {
        throw new Error('Method not implemented.')
      }
      accept(v: any): Result<void, string> {
        throw new Error('Method not implemented.')
      }
    }
    class Test2 extends CompositeSpecification {
      isSatisfiedBy(t: any): boolean {
        return 2 > 0
      }
      mutate(t: any): Result<any, string> {
        throw new Error('Method not implemented.')
      }
      accept(v: any): Result<void, string> {
        throw new Error('Method not implemented.')
      }
    }

    const v = new Test1().and(new Test2()).isSatisfiedBy(undefined)
    expect(v).toBe(false)
  })
})

describe('or', () => {
  it('should return true for matched senario', () => {
    class Test1 extends CompositeSpecification {
      isSatisfiedBy(t: any): boolean {
        return 1 > 0
      }
      mutate(t: any): Result<any, string> {
        throw new Error('Method not implemented.')
      }
      accept(v: any): Result<void, string> {
        throw new Error('Method not implemented.')
      }
    }
    class Test2 extends CompositeSpecification {
      isSatisfiedBy(t: any): boolean {
        return 2 > 0
      }
      mutate(t: any): Result<any, string> {
        throw new Error('Method not implemented.')
      }
      accept(v: any): Result<void, string> {
        throw new Error('Method not implemented.')
      }
    }

    const v = new Test1().or(new Test2()).isSatisfiedBy(undefined)
    expect(v).toBe(true)
  })

  it('should return true if any match', () => {
    class Test1 extends CompositeSpecification {
      isSatisfiedBy(t: any): boolean {
        return 0 > 1
      }
      mutate(t: any): Result<any, string> {
        throw new Error('Method not implemented.')
      }
      accept(v: any): Result<void, string> {
        throw new Error('Method not implemented.')
      }
    }
    class Test2 extends CompositeSpecification {
      isSatisfiedBy(t: any): boolean {
        return 2 > 0
      }
      mutate(t: any): Result<any, string> {
        throw new Error('Method not implemented.')
      }
      accept(v: any): Result<void, string> {
        throw new Error('Method not implemented.')
      }
    }

    const v = new Test1().or(new Test2()).isSatisfiedBy(undefined)
    expect(v).toBe(true)
  })

  it('should return false if none match', () => {
    class Test1 extends CompositeSpecification {
      isSatisfiedBy(t: any): boolean {
        return 0 > 1
      }
      mutate(t: any): Result<any, string> {
        throw new Error('Method not implemented.')
      }
      accept(v: any): Result<void, string> {
        throw new Error('Method not implemented.')
      }
    }
    class Test2 extends CompositeSpecification {
      isSatisfiedBy(t: any): boolean {
        return 0 > 1
      }
      mutate(t: any): Result<any, string> {
        throw new Error('Method not implemented.')
      }
      accept(v: any): Result<void, string> {
        throw new Error('Method not implemented.')
      }
    }

    const v = new Test1().or(new Test2()).isSatisfiedBy(undefined)
    expect(v).toBe(false)
  })
})

describe('not', () => {
  it('should return reverse boolean value', () => {
    class Test1 extends CompositeSpecification {
      isSatisfiedBy(t: any): boolean {
        return true
      }
      mutate(t: any): Result<any, string> {
        throw new Error('Method not implemented.')
      }
      accept(v: any): Result<void, string> {
        throw new Error('Method not implemented.')
      }
    }

    const v = new Test1().not().isSatisfiedBy(undefined)
    expect(v).toBe(false)
  })
})

import type { TFunction } from 'i18next'
/* eslint-disable @typescript-eslint/no-explicit-any */
declare const TERMINAL_BRAND: unique symbol
export declare class BrandedTerminal {
  private [TERMINAL_BRAND]?
}

declare type IsAny<T> = unknown extends T ? ([keyof T] extends [never] ? false : true) : false

declare type TerminalType =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | any[]
  | Map<any, any>
  | Set<any>
  | Date
  | RegExp
  | AbortController
  | BrandedTerminal
  | ((...args: any) => any)

export declare type RecursiveKeyOf<T, Prefix extends string = never> = T extends TerminalType
  ? never
  : IsAny<T> extends true
  ? never
  : {
      [K in keyof T & string]: [Prefix] extends [never]
        ? K | RecursiveKeyOf<T[K], K>
        : `${Prefix}.${K}` | RecursiveKeyOf<T[K], `${Prefix}.${K}`>
    }[keyof T & string]

export declare type TypeIfUndefined<C, T, T2> = [C] extends [undefined] ? T : T2
export declare type TypeIfNever<C, T> = [C] extends [never] ? T : C
export declare type AnyIfNever<C> = TypeIfNever<C, any>

export declare type DeepPropertyType<
  T,
  P extends RecursiveKeyOf<T>,
  TT = Exclude<T, undefined>,
> = P extends `${infer Prefix}.${infer Rest}`
  ? Prefix extends keyof TT
    ? Rest extends RecursiveKeyOf<TT[Prefix]>
      ? DeepPropertyType<TT[Prefix], Rest>
      : never
    : never
  : P extends keyof TT
  ? TT[P]
  : never
export {}

export declare type StringIfNever<C> = TypeIfNever<C, string>

export interface ClsStore {
  [key: symbol]: any
  requestId: string
  lang: 'en' | 'zh-CN'
  t: TFunction
  user: {
    userId: string
    isAnonymous?: boolean
    isApiToken?: boolean
  }
  member: {
    memberId: string
    role: string
  }
}

export interface IClsService<S extends ClsStore = ClsStore> {
  getId(): string
  get(): S
  get<R = undefined, T extends RecursiveKeyOf<S> = any, P = DeepPropertyType<S, T>>(
    key?: StringIfNever<T> | keyof S,
  ): TypeIfUndefined<R, TypeIfUndefined<typeof key, S, AnyIfNever<P>>, R>
  set<T extends RecursiveKeyOf<S> = any, P extends DeepPropertyType<S, T> = any>(
    key: StringIfNever<T> | keyof S,
    value: AnyIfNever<P>,
  ): void
}

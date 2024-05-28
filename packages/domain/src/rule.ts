import type { ExceptionBase } from "./exception.base"

export abstract class DomainRules<Err extends ExceptionBase> {
  abstract err: Err
  abstract isBroken(): boolean
}

export function applyRules<Err extends ExceptionBase>(...rules: DomainRules<Err>[]) {
  for (const rule of rules) {
    if (rule.isBroken()) {
      throw rule.err
    }
  }
}

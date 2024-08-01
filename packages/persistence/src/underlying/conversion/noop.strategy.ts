import { UnderlyingConversionStrategy } from "./conversion.interface"

export class NoopConversionStrategy extends UnderlyingConversionStrategy {
  convert(): void | Promise<void> {}
}

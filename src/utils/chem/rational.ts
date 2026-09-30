/**
 * Exact Rational Arithmetic module using BigInt to eliminate floating-point precision issues
 */

export function gcdBigInt(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x === 0n ? 1n : x;
}

export function lcmBigInt(a: bigint, b: bigint): bigint {
  if (a === 0n || b === 0n) return 0n;
  const g = gcdBigInt(a, b);
  return (a / g) * b;
}

export class Rational {
  readonly num: bigint;
  readonly den: bigint;

  constructor(num: bigint | number, den: bigint | number = 1n) {
    let n = typeof num === 'number' ? BigInt(Math.round(num)) : num;
    let d = typeof den === 'number' ? BigInt(Math.round(den)) : den;

    if (d === 0n) {
      throw new Error('Division by zero in Rational fraction');
    }

    if (d < 0n) {
      n = -n;
      d = -d;
    }

    const common = gcdBigInt(n, d);
    this.num = n / common;
    this.den = d / common;
  }

  static zero(): Rational {
    return new Rational(0n, 1n);
  }

  static one(): Rational {
    return new Rational(1n, 1n);
  }

  static fromNumber(val: number): Rational {
    if (Number.isInteger(val)) {
      return new Rational(BigInt(val), 1n);
    }
    // Convert decimal to fraction with precision factor
    const s = val.toString();
    const decimalIndex = s.indexOf('.');
    if (decimalIndex === -1) {
      return new Rational(BigInt(Math.round(val)), 1n);
    }
    const decDigits = s.length - decimalIndex - 1;
    const factor = 10n ** BigInt(decDigits);
    const n = BigInt(Math.round(val * Number(factor)));
    return new Rational(n, factor);
  }

  isZero(): boolean {
    return this.num === 0n;
  }

  isPositive(): boolean {
    return this.num > 0n;
  }

  isNegative(): boolean {
    return this.num < 0n;
  }

  add(other: Rational): Rational {
    const num = this.num * other.den + other.num * this.den;
    const den = this.den * other.den;
    return new Rational(num, den);
  }

  sub(other: Rational): Rational {
    const num = this.num * other.den - other.num * this.den;
    const den = this.den * other.den;
    return new Rational(num, den);
  }

  mul(other: Rational): Rational {
    const num = this.num * other.num;
    const den = this.den * other.den;
    return new Rational(num, den);
  }

  div(other: Rational): Rational {
    if (other.isZero()) {
      throw new Error('Division by zero');
    }
    const num = this.num * other.den;
    const den = this.den * other.num;
    return new Rational(num, den);
  }

  negate(): Rational {
    return new Rational(-this.num, this.den);
  }

  toNumber(): number {
    return Number(this.num) / Number(this.den);
  }

  toString(): string {
    if (this.den === 1n) return this.num.toString();
    return `${this.num}/${this.den}`;
  }
}

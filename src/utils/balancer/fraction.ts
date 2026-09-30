/**
 * Exact Rational Fraction implementation using BigInt.
 * Guarantees zero floating-point drift during Gaussian elimination.
 */

export class Fraction {
  readonly num: bigint;
  readonly den: bigint;

  constructor(num: bigint | number, den: bigint | number = 1n) {
    let n = typeof num === 'number' ? BigInt(Math.round(num)) : num;
    let d = typeof den === 'number' ? BigInt(Math.round(den)) : den;

    if (d === 0n) {
      throw new Error('Division by zero in Fraction');
    }

    if (d < 0n) {
      n = -n;
      d = -d;
    }

    const common = Fraction.gcd(n < 0n ? -n : n, d);
    this.num = n / common;
    this.den = d / common;
  }

  static gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  static lcm(a: bigint, b: bigint): bigint {
    if (a === 0n || b === 0n) return 0n;
    const prod = (a < 0n ? -a : a) * (b < 0n ? -b : b);
    return prod / Fraction.gcd(a < 0n ? -a : a, b < 0n ? -b : b);
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

  add(other: Fraction): Fraction {
    return new Fraction(
      this.num * other.den + other.num * this.den,
      this.den * other.den
    );
  }

  sub(other: Fraction): Fraction {
    return new Fraction(
      this.num * other.den - other.num * this.den,
      this.den * other.den
    );
  }

  mul(other: Fraction): Fraction {
    return new Fraction(this.num * other.num, this.den * other.den);
  }

  div(other: Fraction): Fraction {
    if (other.num === 0n) {
      throw new Error('Division by zero fraction');
    }
    return new Fraction(this.num * other.den, this.den * other.num);
  }

  neg(): Fraction {
    return new Fraction(-this.num, this.den);
  }

  abs(): Fraction {
    return new Fraction(this.num < 0n ? -this.num : this.num, this.den);
  }

  equals(other: Fraction): boolean {
    return this.num === other.num && this.den === other.den;
  }

  toNumber(): number {
    return Number(this.num) / Number(this.den);
  }

  toString(): string {
    if (this.den === 1n) {
      return this.num.toString();
    }
    return `${this.num}/${this.den}`;
  }
}

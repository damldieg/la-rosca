/**
 * The only source of randomness the domain is allowed to depend on. Nothing
 * in core calls Math.random() (or any browser API) directly — it asks for a
 * RandomSource instead, so selection stays swappable and testable.
 */
export interface RandomSource {
  /** A value in [0, 1), the same contract as Math.random(). */
  next(): number
}

/** Production default: a thin, stateless wrapper around Math.random(). */
export class MathRandomSource implements RandomSource {
  next(): number {
    return Math.random()
  }
}

/**
 * Deterministic PRNG (mulberry32) seeded by a plain number. Same seed always
 * produces the same sequence, which is what makes a playthrough reproducible
 * without persisting anything beyond the seed itself.
 */
export class SeededRandomSource implements RandomSource {
  private state: number

  constructor(seed: number) {
    this.state = seed >>> 0
  }

  next(): number {
    this.state = (this.state + 0x6d2b79f5) | 0
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Test double: always returns the same fixed value. */
export class FixedRandomSource implements RandomSource {
  private readonly value: number

  constructor(value: number) {
    this.value = value
  }

  next(): number {
    return this.value
  }
}

/** Test double: cycles through a fixed sequence of values, repeating once exhausted. */
export class SequenceRandomSource implements RandomSource {
  private readonly values: number[]
  private index = 0

  constructor(values: number[]) {
    if (values.length === 0) throw new Error('SequenceRandomSource requires at least one value')
    this.values = values
  }

  next(): number {
    const value = this.values[this.index % this.values.length]
    this.index += 1
    return value
  }
}

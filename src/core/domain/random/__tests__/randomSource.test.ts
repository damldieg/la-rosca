import { describe, expect, it } from 'vitest'
import { FixedRandomSource, MathRandomSource, SeededRandomSource, SequenceRandomSource } from '../randomSource'

describe('MathRandomSource', () => {
  it('returns values in [0, 1)', () => {
    const random = new MathRandomSource()
    for (let i = 0; i < 100; i++) {
      const value = random.next()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})

describe('SeededRandomSource', () => {
  it('returns values in [0, 1)', () => {
    const random = new SeededRandomSource(123)
    for (let i = 0; i < 200; i++) {
      const value = random.next()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })

  it('the same seed produces the exact same sequence', () => {
    const sequenceFrom = (seed: number) => {
      const random = new SeededRandomSource(seed)
      return Array.from({ length: 10 }, () => random.next())
    }

    expect(sequenceFrom(42)).toEqual(sequenceFrom(42))
  })

  it('different seeds produce different sequences', () => {
    const first = new SeededRandomSource(1)
    const second = new SeededRandomSource(2)

    const firstSequence = Array.from({ length: 5 }, () => first.next())
    const secondSequence = Array.from({ length: 5 }, () => second.next())

    expect(firstSequence).not.toEqual(secondSequence)
  })
})

describe('FixedRandomSource', () => {
  it('always returns the same configured value', () => {
    const random = new FixedRandomSource(0.42)
    expect(random.next()).toBe(0.42)
    expect(random.next()).toBe(0.42)
    expect(random.next()).toBe(0.42)
  })
})

describe('SequenceRandomSource', () => {
  it('returns values in the given order, then repeats from the start', () => {
    const random = new SequenceRandomSource([0.1, 0.2, 0.3])

    expect([random.next(), random.next(), random.next(), random.next()]).toEqual([0.1, 0.2, 0.3, 0.1])
  })

  it('rejects an empty sequence', () => {
    expect(() => new SequenceRandomSource([])).toThrow()
  })
})

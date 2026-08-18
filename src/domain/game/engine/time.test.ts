import { describe, expect, it } from 'vitest'
import { advanceTime } from './time'

describe('advanceTime', () => {
  it('advances months within the same year', () => {
    expect(advanceTime({ years: 18, months: 0 }, 6)).toEqual({ years: 18, months: 6 })
  })

  it('rolls over into the next year', () => {
    expect(advanceTime({ years: 18, months: 8 }, 6)).toEqual({ years: 19, months: 2 })
  })

  it('rolls over across multiple years', () => {
    expect(advanceTime({ years: 18, months: 0 }, 30)).toEqual({ years: 20, months: 6 })
  })
})

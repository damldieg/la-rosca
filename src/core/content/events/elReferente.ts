import type { Event } from '../../domain/events/types'

/** militante -> referente, the first real promotion of Fase 7.5's early career. */
export const elReferente: Event = {
  id: 'el_referente',
  title: 'El referente',
  description: 'Ya no sos uno más: la gente de la cuadra empieza a buscarte a vos primero.',
  // No age gate here on purpose: unlike concejal-and-above, there is no other
  // militante-tier content left to pass time with once the flavor events are
  // exhausted — an age floor here would strand the player with zero eligible
  // events and no way to wait it out. Gated on real activity (the flag) instead.
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'militante' },
      { type: 'flag', flag: 'showed_early_commitment', operator: 'exists' },
    ],
  },
  // repeatable, not milestone/oneShot: with no other militante-tier content left
  // once the flag is earned, a oneShot event whose "decline" choice was picked
  // would vanish forever and permanently strand the player at militante — a real
  // dead end a 1000-game audit caught under uniform-random play.
  lifecycle: { type: 'repeatable' },
  choices: [
    {
      id: 'asumir_como_referente',
      text: 'Asumir como referente de la zona',
      role: 'referente',
      effects: { power: 8, structure: 5 },
      durationMonths: 4,
    },
    {
      id: 'seguir_como_militante',
      text: 'No sentirte listo todavía',
      effects: { structure: 2 },
      durationMonths: 2,
    },
  ],
}

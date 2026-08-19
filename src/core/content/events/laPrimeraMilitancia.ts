import type { Event } from '../../domain/events/types'

export const laPrimeraMilitancia: Event = {
  id: 'la_primera_militancia',
  title: 'La primera militancia',
  description: 'Un compañero del comité te invita a tu primera reunión partidaria.',
  conditions: { type: 'role', operator: 'equals', value: 'militante' },
  // Both choices grant showed_early_commitment on purpose: el_referente gates on
  // having *experienced* a first militancia, not on which choice was picked. A
  // 1000-game audit found that gating on only one choice left ~75% of games
  // permanently stuck at militante under uniform-random play — the flag is what
  // el_referente needs to ever become eligible again, and once this event
  // resolves (oneShot) there is no second chance to set it.
  choices: [
    {
      id: 'sumarte_de_lleno',
      text: 'Sumarte de lleno, ir a cada actividad',
      addFlags: ['showed_early_commitment'],
      effects: { popularity: 4, structure: 3 },
      durationMonths: 2,
    },
    {
      id: 'ir_de_a_poco',
      text: 'Ir probando, sin comprometerte del todo',
      addFlags: ['showed_early_commitment'],
      effects: { popularity: 1 },
      durationMonths: 2,
    },
  ],
}

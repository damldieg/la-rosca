import type { Event } from '../../domain/events/types'

export const elDebateTelevisivo: Event = {
  id: 'el_debate_televisivo',
  title: 'El debate televisivo',
  description: 'Te invitan a un debate en vivo contra un rival directo.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'mediatica' },
  choices: [
    {
      id: 'ir_al_choque',
      text: 'Ir al choque directo con el rival',
      effects: { popularity: 6, exposure: 8 },
      relationships: { periodista: 4 },
      durationMonths: 1,
    },
    {
      id: 'jugar_a_lo_seguro',
      text: 'Jugar a lo seguro, sin errores',
      effects: { popularity: 2, exposure: 2 },
      durationMonths: 1,
    },
  ],
}

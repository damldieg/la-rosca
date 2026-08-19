import type { Event } from '../../domain/events/types'

export const laCoherenciaCuestionada: Event = {
  id: 'la_coherencia_cuestionada',
  title: 'La coherencia cuestionada',
  description: 'Las mismas organizaciones que te apoyaron te cuestionan por tus contradicciones.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'party', operator: 'equals', value: 'progresista' },
      { type: 'stat', stat: 'corruption', operator: 'gte', value: 20 },
    ],
  },
  lifecycle: { type: 'cooldown', months: 10 },
  choices: [
    {
      id: 'reconocer_el_error',
      text: 'Reconocer el error públicamente',
      effects: { popularity: 8, corruption: -8 },
      ideology: { institutional: 8 },
      relationships: { organizacionCivil: 10 },
      durationMonths: 1,
    },
    {
      id: 'defender_la_decision',
      text: 'Defender la decisión como necesaria',
      ideology: { institutional: -8 },
      relationships: { organizacionCivil: -15 },
      effects: { popularity: -5 },
      durationMonths: 1,
    },
    {
      id: 'desviar_la_atencion',
      text: 'Desviar la atención hacia otro tema',
      effects: { exposure: 10 },
      relationships: { periodista: -10 },
      durationMonths: 1,
    },
  ],
}

import type { Event } from '../../domain/events/types'

export const elBarometroDeOpinion: Event = {
  id: 'el_barometro_de_opinion',
  title: 'El barómetro de opinión',
  description: 'Un editorial te cuestiona por tu gestión, uno más entre tantos.',
  // exposure >= 10 (not just corruption) so a player who actively manages
  // their exposure down can eventually shake this off — otherwise a merely
  // corrupt-but-unexposed career would face it forever with no way out.
  conditions: {
    type: 'and',
    conditions: [
      { type: 'stat', stat: 'corruption', operator: 'gte', value: 20 },
      { type: 'stat', stat: 'exposure', operator: 'gte', value: 10 },
    ],
  },
  lifecycle: { type: 'repeatable' },
  weightModifiers: [{ conditions: { type: 'stat', stat: 'exposure', operator: 'gte', value: 40 }, modifier: 10 }],
  choices: [
    {
      id: 'responder_con_datos',
      text: 'Responder con datos de gestión',
      effects: { popularity: 3, exposure: -3 },
      durationMonths: 1,
    },
    {
      id: 'ignorar_la_critica',
      text: 'Ignorar la crítica',
      effects: { exposure: 3 },
      durationMonths: 1,
    },
  ],
}

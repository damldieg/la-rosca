import type { Event } from '../../domain/events/types'

/**
 * Governor's own bridge into the cabinet — el_gabinete's senator-only twin.
 * Senador and gobernador are equally high-tier but narratively distinct: a
 * senator gets tapped from the chamber floor, a governor from the province.
 * Same power bar as el_gabinete (50) so neither route is easier than the other.
 */
export const elLlamadoNacional: Event = {
  id: 'el_llamado_nacional',
  title: 'El llamado nacional',
  description: 'Desde la Casa Rosada te llaman: quieren sumar tu gobernación al gabinete nacional.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'gobernador' },
      { type: 'stat', stat: 'power', operator: 'gte', value: 50 },
    ],
  },
  lifecycle: { type: 'milestone' },
  choices: [
    {
      id: 'aceptar_el_gabinete_nacional',
      text: 'Dejar la gobernación y sumarte al gabinete',
      role: 'ministro',
      effects: { power: 10, popularity: 8 },
      durationMonths: 6,
    },
    {
      id: 'seguir_como_gobernador',
      text: 'Quedarte al frente de la provincia por ahora',
      effects: { structure: 3 },
      durationMonths: 1,
    },
  ],
}

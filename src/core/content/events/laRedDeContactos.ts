import type { Event } from '../../domain/events/types'

export const laRedDeContactos: Event = {
  id: 'la_red_de_contactos',
  title: 'La red de contactos',
  description:
    'Empezás a cruzarte siempre con las mismas caras: el puntero de la otra cuadra, el que reparte los bolsones.',
  conditions: { type: 'role', operator: 'equals', value: 'militante' },
  choices: [
    {
      id: 'tejer_relaciones',
      text: 'Tejer relaciones con todos los que puedas',
      addFlags: ['built_early_network'],
      relationships: { jefePartidario: 8 },
      effects: { structure: 4 },
      durationMonths: 3,
    },
    {
      id: 'mantener_perfil_bajo',
      text: 'Mantener un perfil bajo por ahora',
      effects: { structure: 1 },
      durationMonths: 3,
    },
  ],
}

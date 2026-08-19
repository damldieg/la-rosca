import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const elLobbyEmpresarial: Event = {
  id: 'el_lobby_empresarial',
  title: 'El lobby empresarial',
  description: 'Una cámara empresaria te pide reunirte para "alinear expectativas" antes de una votación clave.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'empresarial' },
  choices: [
    {
      id: 'recibirlos',
      text: 'Recibirlos y escuchar su propuesta',
      relationships: { empresario: 8 },
      effects: { money: MONEY_SCALE.LOCAL_FAVOR, exposure: 5 },
      durationMonths: 1,
    },
    {
      id: 'mantener_distancia',
      text: 'Mantener distancia pública, negociar en privado después',
      relationships: { empresario: 3 },
      effects: { exposure: -2 },
      durationMonths: 1,
    },
  ],
}

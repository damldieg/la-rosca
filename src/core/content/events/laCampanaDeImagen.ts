import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laCampanaDeImagen: Event = {
  id: 'la_campana_de_imagen',
  title: 'La campaña de imagen',
  description: 'Un consultor te propone una campaña de imagen para instalar tu nombre.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'mediatica' },
  choices: [
    {
      id: 'invertir_en_imagen',
      text: 'Invertir en la campaña',
      effects: { money: -MONEY_SCALE.MEDIA_OPERATION, popularity: 8 },
      durationMonths: 2,
    },
    {
      id: 'construir_organicamente',
      text: 'Construir imagen de forma orgánica, sin gastar',
      effects: { popularity: 2 },
      durationMonths: 2,
    },
  ],
}

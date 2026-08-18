import { MONEY_SCALE } from '../../domain/game/economy'
import type { PoliticalParty } from '../../domain/party/types'

export const progresista: PoliticalParty = {
  id: 'progresista',
  name: 'Alianza Progresista Ciudadana',
  description:
    'Universidades, organizaciones civiles y buena relación con los medios. Fuerte en la opinión pública, débil en las redes de poder tradicionales.',
  ideology: { economic: -20, social: 60, institutional: 20 },
  startingStats: {
    money: MONEY_SCALE.PUNTERO_STARTING - 100_000,
    popularity: 35,
  },
  preferredStats: ['popularity'],
  initialRelationships: { periodista: 15, empresario: -5 },
  availableRoles: ['puntero', 'asesor', 'concejal', 'diputado', 'senador', 'ministro'],
  preferredEventTags: ['mediático', 'social'],
}
